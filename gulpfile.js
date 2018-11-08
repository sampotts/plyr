// ==========================================================================
// Gulp build script
// ==========================================================================
/* global require, __dirname */
/* eslint no-console: "off" */

const del = require('del');
const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const filter = require('gulp-filter');
const sass = require('gulp-sass');
const cleancss = require('gulp-clean-css');
const header = require('gulp-header');
const prefix = require('gulp-autoprefixer');
const gitbranch = require('git-branch');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const s3 = require('gulp-s3');
const replace = require('gulp-replace');
const open = require('gulp-open');
const size = require('gulp-size');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const FastlyPurge = require('fastly-purge');
const through = require('through2');

const bundles = require('./bundles.json');
const pkg = require('./package.json');

const minSuffix = '.min';

// Paths
const root = __dirname;
const paths = {
    plyr: {
        // Source paths
        src: {
            sass: path.join(root, 'src/sass/**/*.scss'),
            js: path.join(root, 'src/js/**/*.js'),
            sprite: path.join(root, 'src/sprite/*.svg'),
        },

        // Output paths
        output: path.join(root, 'dist/'),
    },
    demo: {
        // Source paths
        src: {
            sass: path.join(root, 'demo/src/sass/**/*.scss'),
            js: path.join(root, 'demo/src/js/**/*.js'),
        },

        // Output paths
        output: path.join(root, 'demo/dist/'),

        // Demo
        root: path.join(root, 'demo/'),
    },
    upload: [
        path.join(root, `dist/*${minSuffix}.*`),
        path.join(root, 'dist/*.css'),
        path.join(root, 'dist/*.svg'),
        path.join(root, `demo/dist/*${minSuffix}.*`),
        path.join(root, 'demo/dist/*.css'),
    ],
};

// Task arrays
const tasks = {
    sass: [],
    js: [],
    sprite: [],
    clean: ['clean'],
};

// Size plugin
const sizeOptions = { showFiles: true, gzip: true };

// Browserlist
const browsers = ['> 1%'];

// Babel config
const babelrc = (polyfill = false) => ({
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers,
                },
                useBuiltIns: polyfill ? 'usage' : false,
                modules: false,
            },
        ],
    ],
    babelrc: false,
    exclude: 'node_modules/**',
});

// Clean out /dist
gulp.task('clean', done => {
    const dirs = [paths.plyr.output, paths.demo.output].map(dir => path.join(dir, '**/*'));

    // Don't delete the mp4
    dirs.push(`!${path.join(paths.plyr.output, '**/*.mp4')}`);

    del(dirs);

    done();
});

const build = {
    js(files, bundle, options) {
        Object.keys(files).forEach(key => {
            const name = `js:${key}`;
            tasks.js.push(name);
            const { output } = paths[bundle];
            const polyfill = name.includes('polyfilled');

            return gulp.task(name, () =>
                gulp
                    .src(bundles[bundle].js[key])
                    .pipe(sourcemaps.init())
                    .pipe(concat(key))
                    .pipe(
                        rollup(
                            {
                                plugins: [resolve(), commonjs(), babel(babelrc(polyfill))],
                            },
                            options,
                        ),
                    )
                    .pipe(header('typeof navigator === "object" && ')) // "Support" SSR (#935)
                    .pipe(sourcemaps.write(''))
                    .pipe(gulp.dest(output))
                    .pipe(filter('**/*.js'))
                    .pipe(uglify())
                    .pipe(size(sizeOptions))
                    .pipe(rename({ suffix: minSuffix }))
                    .pipe(sourcemaps.write(''))
                    .pipe(gulp.dest(output)),
            );
        });
    },
    sass(files, bundle) {
        Object.keys(files).forEach(key => {
            const name = `sass:${key}`;
            tasks.sass.push(name);

            return gulp.task(name, () =>
                gulp
                    .src(bundles[bundle].sass[key])
                    .pipe(sass())
                    .on('error', gutil.log)
                    .pipe(concat(key))
                    .pipe(prefix(browsers, { cascade: false }))
                    .pipe(cleancss())
                    .pipe(size(sizeOptions))
                    .pipe(gulp.dest(paths[bundle].output)),
            );
        });
    },
    sprite(bundle) {
        const name = `svg:sprite:${bundle}`;
        tasks.sprite.push(name);

        // Process Icons
        return gulp.task(name, () =>
            gulp
                .src(paths[bundle].src.sprite)
                .pipe(
                    svgmin({
                        plugins: [
                            {
                                removeDesc: true,
                            },
                        ],
                    }),
                )
                .pipe(svgstore())
                .pipe(rename({ basename: bundle }))
                .pipe(size(sizeOptions))
                .pipe(gulp.dest(paths[bundle].output)),
        );
    },
};

// Plyr core files
build.js(bundles.plyr.js, 'plyr', { name: 'Plyr', format: 'umd' });
build.sass(bundles.plyr.sass, 'plyr');
build.sprite('plyr');

// Demo files
build.sass(bundles.demo.sass, 'demo');
build.js(bundles.demo.js, 'demo', { format: 'iife' });

// Build all JS
gulp.task('js', () => gulp.parallel(tasks.js));

// Watch for file changes
gulp.task('watch', () => {
    // Plyr core
    gulp.watch(paths.plyr.src.js, gulp.parallel(tasks.js));
    gulp.watch(paths.plyr.src.sass, gulp.parallel(tasks.sass));
    gulp.watch(paths.plyr.src.sprite, gulp.parallel(tasks.sprite));

    // Demo
    gulp.watch(paths.demo.src.js, gulp.parallel(tasks.js));
    gulp.watch(paths.demo.src.sass, gulp.parallel(tasks.sass));
});

// Build distribution
gulp.task('build', gulp.series(tasks.clean, gulp.parallel(tasks.js, tasks.sass, tasks.sprite)));

// Default gulp task
gulp.task('default', gulp.series('build', 'watch'));

// Publish a version to CDN and demo
// --------------------------------------------
// Get deployment config
let credentials = {};
try {
    credentials = require('./credentials.json'); //eslint-disable-line
} catch (e) {
    // Do nothing
}

// If deployment is setup
if (Object.keys(credentials).includes('aws') && Object.keys(credentials).includes('fastly')) {
    const { version } = pkg;
    const { aws, fastly } = credentials;

    // Get branch info
    const branch = {
        current: gitbranch.sync(),
        master: 'master',
        develop: 'develop',
    };

    const maxAge = 31536000; // 1 year
    const options = {
        cdn: {
            headers: {
                'Cache-Control': `max-age=${maxAge}`,
                Vary: 'Accept-Encoding',
            },
        },
        demo: {
            uploadPath: branch.current === branch.develop ? 'beta/' : null,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                Vary: 'Accept-Encoding',
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

    const regex =
        '(?:0|[1-9][0-9]*)\\.(?:0|[1-9][0-9]*).(?:0|[1-9][0-9]*)(?:-[\\da-z\\-]+(?:.[\\da-z\\-]+)*)?(?:\\+[\\da-z\\-]+(?:.[\\da-z\\-]+)*)?';
    const semver = new RegExp(`v${regex}`, 'gi');
    const localPath = new RegExp('(../)?dist', 'gi');
    const versionPath = `https://${aws.cdn.domain}/${version}`;
    const cdnpath = new RegExp(`${aws.cdn.domain}/${regex}/`, 'gi');

    const renameFile = rename(p => {
        p.basename = p.basename.replace(minSuffix, ''); // eslint-disable-line
        p.dirname = p.dirname.replace('.', version); // eslint-disable-line
    });

    // Check we're on the correct branch to deploy
    const canDeploy = () => {
        const allowed = [branch.master, branch.develop];

        if (!allowed.includes(branch.current)) {
            console.error(`Must be on ${allowed.join(', ')} to publish! (current: ${branch.current})`);

            return false;
        }

        return true;
    };

    gulp.task('version', () => {
        if (!canDeploy()) {
            return null;
        }

        console.log(`Updating versions to '${version}'...`);

        // Replace versioned URLs in source
        const files = ['plyr.js', 'plyr.polyfilled.js', 'config/defaults.js'];

        return gulp
            .src(files.map(file => path.join(root, `src/js/${file}`)), { base: '.' })
            .pipe(replace(semver, `v${version}`))
            .pipe(replace(cdnpath, `${aws.cdn.domain}/${version}/`))
            .pipe(gulp.dest('./'));
    });

    // Publish version to CDN bucket
    gulp.task('cdn', () => {
        if (!canDeploy()) {
            return null;
        }

        console.log(`Uploading '${version}' to ${aws.cdn.domain}...`);

        // Upload to CDN
        return (
            gulp
                .src(paths.upload)
                .pipe(renameFile)
                // Remove min suffix from source map URL
                .pipe(
                    replace(
                        /sourceMappingURL=([\w-?.]+)/,
                        (match, p1) => `sourceMappingURL=${p1.replace(minSuffix, '')}`,
                    ),
                )
                .pipe(
                    size({
                        showFiles: true,
                        gzip: true,
                    }),
                )
                .pipe(replace(localPath, versionPath))
                .pipe(s3(aws.cdn, options.cdn))
        );
    });

    // Purge the fastly cache incase any 403/404 are cached
    gulp.task('purge', () => {
        const list = [];

        return gulp
            .src(paths.upload)
            .pipe(
                through.obj((file, enc, cb) => {
                    const filename = file.path.split('/').pop();
                    list.push(`${versionPath}/${filename}`);
                    cb(null);
                }),
            )
            .on('end', () => {
                const purge = new FastlyPurge(fastly.token);

                list.forEach(url => {
                    console.log(`Purging ${url}...`);

                    purge.url(url, (error, result) => {
                        if (error) {
                            console.log(error);
                        } else if (result) {
                            console.log(result);
                        }
                    });
                });
            });
    });

    // Publish to demo bucket
    gulp.task('demo', () => {
        if (!canDeploy()) {
            return null;
        }

        console.log(`Uploading '${version}' demo to ${aws.demo.domain}...`);

        // Replace versioned files in readme.md
        gulp.src([`${root}/readme.md`])
            .pipe(replace(cdnpath, `${aws.cdn.domain}/${version}/`))
            .pipe(gulp.dest(root));

        // Replace local file paths with remote paths in demo HTML
        // e.g. "../dist/plyr.js" to "https://cdn.plyr.io/x.x.x/plyr.js"
        const index = `${paths.demo.root}index.html`;
        const error = `${paths.demo.root}error.html`;
        const pages = [index];

        if (branch.current === branch.master) {
            pages.push(error);
        }

        gulp.src(pages)
            .pipe(replace(localPath, versionPath))
            .pipe(s3(aws.demo, options.demo));

        // Only update CDN for master (prod)
        if (branch.current !== branch.master) {
            return null;
        }

        // Upload error.html to cdn (as well as demo site)
        return gulp
            .src([error])
            .pipe(replace(localPath, versionPath))
            .pipe(s3(aws.cdn, options.demo));
    });

    // Update symlinks for latest
    /* gulp.task("symlinks", function () {
        console.log("Updating symlinks...");

        return gulp.src(paths.upload)
            .pipe(through.obj(function (chunk, enc, callback) {
                if (chunk.stat.isFile()) {
                    // Get the filename
                    var filename = chunk.path.split("/").reverse()[0];

                    // Create the 0 byte redirect files to upload
                    createFile(filename, "")
                        .pipe(rename(function (path) {
                            path.dirname = path.dirname.replace(".", "latest");
                        }))
                        // Upload to S3 with correct headers
                        .pipe(s3(aws.cdn, options.symlinks(version, filename)));
                }

                callback(null, chunk);
            }));
    }); */

    // Open the demo site to check it's ok
    gulp.task('open', callback => {
        gulp.src(__filename).pipe(
            open({
                uri: `https://${aws.demo.domain}`,
            }),
        );

        callback();
    });

    // Do everything
    gulp.task(
        'deploy',
        gulp.series(
            'version',
            tasks.clean,
            gulp.parallel(tasks.js, tasks.sass, tasks.sprite),
            'cdn',
            'demo',
            'purge',
            'open',
        ),
    );
}
