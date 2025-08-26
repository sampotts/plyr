// ==========================================================================
// Publish a version to CDN and demo (ESM version)
// ==========================================================================

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import gulp from 'gulp';
import gitbranch from 'git-branch';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import { green, cyan, bold } from 'colorette';
import log from 'fancy-log';
import open from 'gulp-open';
import size from 'gulp-size';
import aws from 'aws-sdk';
import publish from 'gulp-awspublish';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const pkg = JSON.parse(readFileSync(join(path.resolve(), 'package.json'), 'utf-8'));
const deploy = JSON.parse(readFileSync(join(path.resolve(), 'deploy.json'), 'utf-8'));

// Info from package
const { version } = pkg;
const minSuffix = '.min';

// Get AWS config
Object.values(deploy).forEach((target) => {
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
const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

// Get git branch info
const currentBranch = (() => {
  try {
    return gitbranch.sync();
  } catch (_) {
    return null;
  }
})();

const branch = {
  current: currentBranch,
  isMaster: currentBranch === 'master',
  isBeta: currentBranch === 'beta',
};

const maxAge = 31536000; // 1 year
const options = {
  cdn: {
    headers: {
      'Cache-Control': `max-age=${maxAge}, immutable`,
    },
  },
  demo: {
    uploadPath: branch.isBeta ? '/beta' : null,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    },
  },
  symlinks(ver, filename) {
    return {
      headers: {
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

const renameFile = rename((p) => {
  p.basename = p.basename.replace(minSuffix, ''); // eslint-disable-line
  p.dirname = p.dirname.replace('.', version); // eslint-disable-line
});

// Check we're on the correct branch to deploy
const canDeploy = () => {
  if (![branch.isMaster, branch.isBeta].some(Boolean)) {
    console.error(`Must be on an allowed branch to publish! (current: ${branch.current})`);
    return false;
  }

  return true;
};

export const versionTask = (done) => {
  if (!canDeploy()) {
    done();
    return null;
  }

  const { domain } = deploy.cdn;

  log(`Updating version in files to ${green(bold(version))}...`);

  // Replace versioned URLs in source
  const files = ['plyr.js', 'plyr.polyfilled.js', 'config/defaults.js'];

  return gulp
    .src(
      files.map((file) => path.join(root, `src/js/${file}`)),
      { base: '.' },
    )
    .pipe(replace(semver, `v${version}`))
    .pipe(replace(cdnpath, `${domain}/${version}/`))
    .pipe(gulp.dest('./'));
};

export const cdnTask = (done) => {
  if (!canDeploy()) {
    done();
    return null;
  }

  const { domain, publisher } = deploy.cdn;

  if (!publisher) {
    throw new Error('No publisher instance. Check AWS configuration.');
  }

  log(`Uploading ${green(bold(pkg.version))} to ${cyan(domain)}...`);

  // Upload to CDN
  return gulp
    .src(paths.upload)
    .pipe(renameFile)
    .pipe(
      replace(
        /sourceMappingURL=([\w-?.]+)/,
        (match, filename) => `sourceMappingURL=${filename.replace(minSuffix, '')}`,
      ),
    )
    .pipe(size(sizeOptions))
    .pipe(replace(localPath, versionPath))
    .pipe(publisher.publish(options.cdn.headers))
    .pipe(publish.reporter());
};

export const demoTask = (done) => {
  if (!canDeploy()) {
    done();
    return null;
  }

  const { publisher } = deploy.demo;
  const { domain } = deploy.cdn;

  if (!publisher) {
    throw new Error('No publisher instance. Check AWS configuration.');
  }

  log(`Uploading ${green(bold(pkg.version))} to ${cyan(domain)}...`);

  // Replace versioned files in README.md
  gulp
    .src([`${root}/README.md`])
    .pipe(replace(cdnpath, `${domain}/${version}/`))
    .pipe(gulp.dest(root));

  // Replace local file paths with remote paths in demo HTML
  const index = `${paths.demo}index.html`;
  const error = `${paths.demo}error.html`;
  const pages = [index];

  if (branch.isMaster) {
    pages.push(error);
  }

  return gulp
    .src(pages)
    .pipe(replace(localPath, versionPath))
    .pipe(
      rename((p) => {
        if (options.demo.uploadPath) {
          p.dirname += options.demo.uploadPath;
        }
      }),
    )
    .pipe(publisher.publish(options.demo.headers))
    .pipe(publish.reporter());
};

export const openTask = () => {
  const { domain } = deploy.demo;

  return gulp.src(__filename).pipe(
    open({
      uri: `https://${domain}/${branch.isBeta ? 'beta' : ''}`,
    }),
  );
};

export const deployTask = gulp.series(cdnTask, demoTask, openTask);

export default deployTask;
