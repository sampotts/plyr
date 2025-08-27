import { readFileSync } from 'node:fs';
import path, { join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { S3Client } from '@aws-sdk/client-s3';
import aws from 'aws-sdk';
import { bold, cyan, green } from 'colorette';
import log from 'fancy-log';
import gitbranch from 'git-branch';
import gulp from 'gulp';
import open from 'gulp-open';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import size from 'gulp-size';

import { publish } from './utils/publish.js';
import 'dotenv/config';

// Convert `import.meta.url` to `__filename` and `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(readFileSync(join(path.resolve(), 'package.json'), 'utf-8'));
const config = JSON.parse(readFileSync(join(path.resolve(), 'deploy.json'), 'utf-8'));

// Info from package
const { version } = pkg;
const minSuffix = '.min';

// Get AWS config
const jobs = Object.fromEntries(Object.entries(config).map(([name, options]) => [name, {
  ...options,
  client: options.type === 'r2'
    ? new S3Client({
      region: 'auto',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
      endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    })
    : new S3Client({
      region: options.region,
      credentials: new aws.SharedIniFileCredentials({ profile: 'plyr' }),
    }),
}]));

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

// Get git branch info
const currentBranch = (() => {
  try {
    return gitbranch.sync();
  }
  catch {
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
};

// Size plugin
const sizeOptions = { showFiles: true, gzip: true };

const regex = '(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)(?:-[\\da-z\\-]+(?:\\.[\\da-z\\-]+)*)?(?:\\+[\\da-z\\-]+(?:\\.[\\da-z\\-]+)*)?';
const semver = new RegExp(`v${regex}`, 'gi');
const localPath = /(..\/)?dist\//gi;
const versionPath = `https://${jobs.cdn.domain}/${version}/`;
const cdnPath = new RegExp(`${jobs.cdn.domain}/${regex}/`, 'gi');

const renameFile = rename((p) => {
  p.basename = p.basename.replace(minSuffix, '');
  p.dirname = p.dirname.replace('.', version);
});

// Check we're on the correct branch to deploy
function canDeploy() {
  if (![branch.isMaster, branch.isBeta].some(Boolean)) {
    console.error(`Must be on an allowed branch to publish! (current: ${branch.current})`);
    return false;
  }

  return true;
}

export function prepare(done) {
  if (!canDeploy()) {
    done();
    return null;
  }

  const { domain } = jobs.cdn;

  log(`Updating version in files to ${green(bold(version))}...`);

  // Replace versioned URLs in source
  const files = ['plyr.js', 'plyr.polyfilled.js', 'config/defaults.js'];

  return gulp
    .src(
      files.map(file => path.join(root, `src/js/${file}`)),
      { base: '.' },
    )
    .pipe(replace(semver, `v${version}`))
    .pipe(replace(cdnPath, `${domain}/${version}/`))
    .pipe(gulp.dest('./'));
}

function cdn(done) {
  if (!canDeploy()) {
    done();
    return null;
  }

  const { domain, client, bucket } = jobs.cdn;

  log(`Uploading ${green(bold(pkg.version))} to ${cyan(domain)}...`);

  // Upload to CDN
  return gulp
    .src(paths.upload)
    .pipe(renameFile)
    .pipe(
      replace(
        /sourceMappingURL=([\w\-?.]+)/,
        (_, filename) => `sourceMappingURL=${filename.replace(minSuffix, '')}`,
      ),
    )
    .pipe(size(sizeOptions))
    .pipe(replace(localPath, versionPath))
    .pipe(publish(client, bucket, options.cdn.headers));
}

function demo(done) {
  if (!canDeploy()) {
    done();
    return null;
  }

  const { client, bucket, domain } = jobs.demo;
  log(`Uploading ${green(bold(pkg.version))} to ${cyan(domain)}...`);

  // Replace versioned files in README.md
  gulp
    .src([`${root}/README.md`])
    .pipe(replace(cdnPath, `${jobs.cdn.domain}/${version}/`))
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
    .pipe(publish(client, bucket, options.demo.headers));
}

function preview() {
  const { domain } = jobs.demo;

  return gulp.src(__filename).pipe(
    open({
      uri: `https://${domain}/${branch.isBeta ? 'beta' : ''}`,
    }),
  );
}

export const deploy = gulp.series(cdn, demo, preview);
