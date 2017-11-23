// ==========================================================================
// Gulp build script
// ==========================================================================
/* global require, __dirname */
/* eslint no-console: "off" */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const less = require('gulp-less');
const sass = require('gulp-sass');
const cleancss = require('gulp-clean-css');
const run = require('run-sequence');
const prefix = require('gulp-autoprefixer');
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
const uglify = require('rollup-plugin-uglify');
const { minify } = require('uglify-es');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');

const bundles = require('./bundles.json');
const pkg = require('./package.json');
const aws = require('./aws.json');

// Paths
const root = __dirname;
const paths = {
    plyr: {
        // Source paths
        src: {
            less: path.join(root, 'src/less/**/*'),
            sass: path.join(root, 'src/sass/**/*'),
            js: path.join(root, 'src/js/**/*'),
            sprite: path.join(root, 'src/sprite/*.svg'),
        },

        // Output paths
        output: path.join(root, 'dist/'),
    },
    demo: {
        // Source paths
        src: {
            less: path.join(root, 'demo/src/less/**/*'),
            js: path.join(root, 'demo/src/js/**/*'),
        },

        // Output paths
        output: path.join(root, 'demo/dist/'),

        // Demo
        root: path.join(root, 'demo/'),
    },
    upload: [path.join(root, 'dist/**'), path.join(root, 'demo/dist/**')],
};

// Task arrays
const tasks = {
    less: [],
    sass: [],
    js: [],
    sprite: [],
};

// Size plugin
const sizeOptions = { showFiles: true, gzip: true };

// Browserlist
const browsers = ['> 1%'];

// Babel config
const babelrc = {
    presets: [
        [
            'env',
            {
                targets: {
                    browsers,
                },
                useBuiltIns: true,
                modules: false,
            },
        ],
    ],
    plugins: ['external-helpers'],
    babelrc: false,
    exclude: 'node_modules/**',
};

const build = {
    js(files, bundle, options) {
        Object.keys(files).forEach(key => {
            const name = `js-${key}`;
            tasks.js.push(name);

            gulp.task(name, () =>
                gulp
                    .src(bundles[bundle].js[key])
                    .pipe(concat(key))
                    .pipe(sourcemaps.init())
                    .pipe(
                        rollup(
                            {
                                plugins: [resolve(), commonjs(), babel(babelrc), uglify({}, minify)],
                            },
                            options
                        )
                    )
                    .pipe(size(sizeOptions))
                    .pipe(sourcemaps.write(''))
                    .pipe(gulp.dest(paths[bundle].output))
            );
        });
    },
    less(files, bundle) {
        Object.keys(files).forEach(key => {
            const name = `less-${key}`;
            tasks.less.push(name);

            gulp.task(name, () =>
                gulp
                    .src(bundles[bundle].less[key])
                    .pipe(less())
                    .on('error', gutil.log)
                    .pipe(concat(key))
                    .pipe(prefix(browsers, { cascade: false }))
                    .pipe(cleancss())
                    .pipe(size(sizeOptions))
                    .pipe(gulp.dest(paths[bundle].output))
            );
        });
    },
    sass(files, bundle) {
        Object.keys(files).forEach(key => {
            const name = `sass-${key}`;
            tasks.sass.push(name);

            gulp.task(name, () =>
                gulp
                    .src(bundles[bundle].sass[key])
                    .pipe(sass())
                    .on('error', gutil.log)
                    .pipe(concat(key))
                    .pipe(prefix(browsers, { cascade: false }))
                    .pipe(cleancss())
                    .pipe(size(sizeOptions))
                    .pipe(gulp.dest(paths[bundle].output))
            );
        });
    },
    sprite(bundle) {
        const name = `sprite-${bundle}`;
        tasks.sprite.push(name);

        // Process Icons
        gulp.task(name, () =>
            gulp
                .src(paths[bundle].src.sprite)
                .pipe(
                    svgmin({
                        plugins: [
                            {
                                removeDesc: true,
                            },
                        ],
                    })
                )
                .pipe(svgstore())
                .pipe(rename({ basename: bundle }))
                .pipe(size(sizeOptions))
                .pipe(gulp.dest(paths[bundle].output))
        );
    },
};

// Plyr core files
build.js(bundles.plyr.js, 'plyr', { name: 'Plyr', format: 'umd' });
build.less(bundles.plyr.less, 'plyr');
build.sass(bundles.plyr.sass, 'plyr');
build.sprite('plyr');

// Demo files
build.less(bundles.demo.less, 'demo');
build.js(bundles.demo.js, 'demo', { format: 'es' });

// Build all JS
gulp.task('js', () => {
    run(tasks.js);
});

// Build sass (for testing, default is LESS)
gulp.task('sass', () => {
    run(tasks.sass);
});

// Watch for file changes
gulp.task('watch', () => {
    // Plyr core
    gulp.watch(paths.plyr.src.js, tasks.js);
    gulp.watch(paths.plyr.src.less, tasks.less);
    gulp.watch(paths.plyr.src.sprite, tasks.sprite);

    // Demo
    gulp.watch(paths.demo.src.js, tasks.js);
    gulp.watch(paths.demo.src.less, tasks.less);
});

// Default gulp task
gulp.task('default', () => {
    run(tasks.js, tasks.less, tasks.sprite, 'watch');
});

// Publish a version to CDN and demo
// --------------------------------------------
const { version } = pkg;
const maxAge = 31536000; // 1 year
const options = {
    cdn: {
        headers: {
            'Cache-Control': `max-age=${maxAge}`,
            Vary: 'Accept-Encoding',
        },
    },
    demo: {
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

// If aws is setup
if ('cdn' in aws) {
    const regex =
        '(?:0|[1-9][0-9]*)\\.(?:0|[1-9][0-9]*).(?:0|[1-9][0-9]*)(?:-[\\da-z\\-]+(?:.[\\da-z\\-]+)*)?(?:\\+[\\da-z\\-]+(?:.[\\da-z\\-]+)*)?';
    const cdnpath = new RegExp(`${aws.cdn.domain}/${regex}`, 'gi');
    const semver = new RegExp(`v${regex}`, 'gi');
    const localPath = new RegExp('(../)?dist', 'gi');
    const versionPath = `https://${aws.cdn.domain}/${version}`;

    // Publish version to CDN bucket
    gulp.task('cdn', () => {
        console.log(`Uploading ${version} to ${aws.cdn.domain}...`);

        // Upload to CDN
        return gulp
            .src(paths.upload)
            .pipe(
                size({
                    showFiles: true,
                    gzip: true,
                })
            )
            .pipe(
                rename(p => {
                    // eslint-disable-next-line
                    p.dirname = p.dirname.replace('.', version);
                })
            )
            .pipe(replace(localPath, versionPath))
            .pipe(s3(aws.cdn, options.cdn));
    });

    // Publish to demo bucket
    gulp.task('demo', () => {
        console.log(`Uploading ${version} demo to ${aws.demo.domain}...`);

        // Replace versioned files in readme.md
        gulp
            .src([`${root}/readme.md`])
            .pipe(replace(cdnpath, `${aws.cdn.domain}/${version}`))
            .pipe(gulp.dest(root));

        // Replace versioned files in plyr.js
        gulp
            .src(path.join(root, 'src/js/plyr.js'))
            .pipe(replace(semver, `v${version}`))
            .pipe(replace(cdnpath, `${aws.cdn.domain}/${version}`))
            .pipe(gulp.dest(path.join(root, 'src/js/')));

        // Replace local file paths with remote paths in demo HTML
        // e.g. "../dist/plyr.js" to "https://cdn.plyr.io/x.x.x/plyr.js"
        gulp
            .src([`${paths.demo.root}*.html`])
            .pipe(replace(localPath, versionPath))
            .pipe(s3(aws.demo, options.demo));

        // Upload error.html to cdn (as well as demo site)
        return gulp
            .src([`${paths.demo.root}error.html`])
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

    // Open the demo site to check it's sweet
    gulp.task('open', () => {
        console.log(`Opening ${aws.demo.domain}...`);

        // A file must be specified or gulp will skip the task
        // Doesn't matter which file since we set the URL above
        // Weird, I know...
        return gulp.src([`${paths.demo.root}index.html`]).pipe(
            open('', {
                url: `http://${aws.demo.domain}`,
            })
        );
    });

    // Do everything
    gulp.task('publish', () => {
        run(tasks.js, tasks.less, tasks.sprite, 'cdn', 'demo');
    });
}
