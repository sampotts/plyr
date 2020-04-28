/* eslint-disable import/no-extraneous-dependencies */
// ==========================================================================
// Publish a version to CDN and demo
// ==========================================================================
/* eslint no-console: "off" */

const path = require('path');
const gulp = require('gulp');
// Utils
const gitbranch = require('git-branch');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const ansi = require('ansi-colors');
const log = require('fancy-log');
const open = require('gulp-open');
const size = require('gulp-size');
const through = require('through2');
// Deployment
const aws = require('aws-sdk');
const publish = require('gulp-awspublish');
const FastlyPurge = require('fastly-purge');
// Configs
const pkg = require('../package.json');
const deploy = require('../deploy.json');
// Info from package
const { version } = pkg;
const minSuffix = '.min';

// Get AWS config
Object.values(deploy).forEach(target => {
  Object.assign(target, {
    publisher: publish.create({
      region: target.region,
      params: {
        Bucket: target.bucket,
      },
      credentials: new aws.SharedIniFileCredentials({ profile: 'plyr' }),
    }),
  });
});

// Paths
const root = path.join(__dirname, '..');
const paths = {
  demo: path.join(root, 'demo/'),
  upload: [
    path.join(root, `dist/*${minSuffix}.*`),
    path.join(root, 'dist/*.css'),
    path.join(root, 'dist/*.svg'),
    path.join(root, `demo/dist/*${minSuffix}.*`),
    path.join(root, 'demo/dist/*.css'),
    path.join(root, 'demo/dist/*.svg'),
  ],
};

// Get credentials
let credentials = {};
try {
  credentials = require('../credentials.json'); //eslint-disable-line
} catch (e) {
  // Do nothing
}

// Get branch info
const branch = {
  current: gitbranch.sync(),
  master: 'master',
  beta: 'beta',
};

const maxAge = 31536000; // 1 year
const options = {
  cdn: {
    headers: {
      'Cache-Control': `max-age=${maxAge}, immutable`,
    },
  },
  demo: {
    uploadPath: branch.current === branch.beta ? '/beta' : null,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    },
  },
  symlinks(ver, filename) {
    return {
      headers: {
        // http://stackoverflow.com/questions/2272835/amazon-s3-object-redirect
        'x-amz-website-redirect-location': `/${ver}/${filename}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      },
    };
  },
};

// Size plugin
const sizeOptions = { showFiles: true, gzip: true };

const regex =
  '(?:0|[1-9][0-9]*)\\.(?:0|[1-9][0-9]*).(?:0|[1-9][0-9]*)(?:-[\\da-z\\-]+(?:.[\\da-z\\-]+)*)?(?:\\+[\\da-z\\-]+(?:.[\\da-z\\-]+)*)?';
const semver = new RegExp(`v${regex}`, 'gi');
const localPath = new RegExp('(../)?dist/', 'gi');
const versionPath = `https://${deploy.cdn.domain}/${version}/`;
const cdnpath = new RegExp(`${deploy.cdn.domain}/${regex}/`, 'gi');

const renameFile = rename(p => {
  p.basename = p.basename.replace(minSuffix, ''); // eslint-disable-line
  p.dirname = p.dirname.replace('.', version); // eslint-disable-line
});

// Check we're on the correct branch to deploy
const canDeploy = () => {
  const allowed = [branch.master, branch.beta];

  if (!allowed.includes(branch.current)) {
    console.error(`Must be on ${allowed.join(', ')} to publish! (current: ${branch.current})`);

    return false;
  }

  return true;
};

gulp.task('version', done => {
  if (!canDeploy()) {
    done();
    return null;
  }

  const { domain } = deploy.cdn;

  log(`Updating version in files to ${ansi.green.bold(version)}...`);

  // Replace versioned URLs in source
  const files = ['plyr.js', 'plyr.polyfilled.js', 'config/defaults.js'];

  return gulp
    .src(
      files.map(file => path.join(root, `src/js/${file}`)),
      { base: '.' },
    )
    .pipe(replace(semver, `v${version}`))
    .pipe(replace(cdnpath, `${domain}/${version}/`))
    .pipe(gulp.dest('./'));
});

// Publish version to CDN bucket
gulp.task('cdn', done => {
  if (!canDeploy()) {
    done();
    return null;
  }

  const { domain, publisher } = deploy.cdn;

  if (!publisher) {
    throw new Error('No publisher instance. Check AWS configuration.');
  }

  log(`Uploading ${ansi.green.bold(pkg.version)} to ${ansi.cyan(domain)}...`);

  // Upload to CDN
  return (
    gulp
      .src(paths.upload)
      .pipe(renameFile)
      // Remove min suffix from source map URL
      .pipe(
        replace(
          /sourceMappingURL=([\w-?.]+)/,
          (match, filename) => `sourceMappingURL=${filename.replace(minSuffix, '')}`,
        ),
      )
      .pipe(size(sizeOptions))
      .pipe(replace(localPath, versionPath))
      .pipe(publisher.publish(options.cdn.headers))
      .pipe(publish.reporter())
  );
});

// Purge the fastly cache incase any 403/404 are cached
gulp.task('purge', () => {
  if (!Object.keys(credentials).includes('fastly')) {
    throw new Error('Fastly credentials required to purge cache.');
  }

  const { fastly } = credentials;
  const list = [];

  return gulp
    .src(paths.upload)
    .pipe(
      through.obj((file, enc, cb) => {
        const filename = file.path.split('/').pop();
        list.push(`${versionPath}${filename.replace(minSuffix, '')}`);
        cb(null);
      }),
    )
    .on('end', () => {
      const purge = new FastlyPurge(fastly.token);

      list.forEach(url => {
        log(`Purging ${ansi.cyan(url)}...`);

        purge.url(url, (error, result) => {
          if (error) {
            log.error(error);
          } else if (result) {
            log(result);
          }
        });
      });
    });
});

// Publish to demo bucket
gulp.task('demo', done => {
  if (!canDeploy()) {
    done();
    return null;
  }

  const { publisher } = deploy.demo;
  const { domain } = deploy.cdn;

  if (!publisher) {
    throw new Error('No publisher instance. Check AWS configuration.');
  }

  log(`Uploading ${ansi.green.bold(pkg.version)} to ${ansi.cyan(domain)}...`);

  // Replace versioned files in README.md
  gulp
    .src([`${root}/README.md`])
    .pipe(replace(cdnpath, `${domain}/${version}/`))
    .pipe(gulp.dest(root));

  // Replace local file paths with remote paths in demo HTML
  // e.g. "../dist/plyr.js" to "https://cdn.plyr.io/x.x.x/plyr.js"
  const index = `${paths.demo}index.html`;
  const error = `${paths.demo}error.html`;
  const pages = [index];

  if (branch.current === branch.master) {
    pages.push(error);
  }

  return gulp
    .src(pages)
    .pipe(replace(localPath, versionPath))
    .pipe(
      rename(p => {
        if (options.demo.uploadPath) {
          // eslint-disable-next-line no-param-reassign
          p.dirname += options.demo.uploadPath;
        }
      }),
    )
    .pipe(publisher.publish(options.demo.headers))
    .pipe(publish.reporter());
});

// Open the demo site to check it's ok
gulp.task('open', () => {
  const { domain } = deploy.demo;

  return gulp.src(__filename).pipe(
    open({
      uri: `https://${domain}/${branch.current === branch.beta ? 'beta' : ''}`,
    }),
  );
});

// Do everything
gulp.task('deploy', gulp.series('cdn', 'demo', 'purge', 'open'));
