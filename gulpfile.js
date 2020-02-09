// ==========================================================================
// Gulp build script
// ==========================================================================
/* eslint no-console: "off" */

const path = require('path');
const gulp = require('gulp');
// ------------------------------------
// JavaScript
// ------------------------------------
const terser = require('gulp-terser');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
// ------------------------------------
// CSS
// ------------------------------------
const sass = require('gulp-sass');
const clean = require('gulp-clean-css');
const prefix = require('gulp-autoprefixer');
// ------------------------------------
// Images
// ------------------------------------
const svgstore = require('gulp-svgstore');
const imagemin = require('gulp-imagemin');
// ------------------------------------
// Utils
// ------------------------------------
const del = require('del');
const filter = require('gulp-filter');
const header = require('gulp-header');
const gitbranch = require('git-branch');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const ansi = require('ansi-colors');
const log = require('fancy-log');
const open = require('gulp-open');
const plumber = require('gulp-plumber');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const through = require('through2');
const browserSync = require('browser-sync').create();
// ------------------------------------
// Deployment
// ------------------------------------
const aws = require('aws-sdk');
const publish = require('gulp-awspublish');
const FastlyPurge = require('fastly-purge');
// ------------------------------------
// Configs
// ------------------------------------
const pkg = require('./package.json');
const build = require('./build.json');
const deploy = require('./deploy.json');
// ------------------------------------
// Info from package
// ------------------------------------
const { browserslist: browsers, version } = pkg;
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
const paths = {
    plyr: {
        // Source paths
        src: {
            sass: path.join(__dirname, 'src/sass/**/*.scss'),
            js: path.join(__dirname, 'src/js/**/*.js'),
            sprite: path.join(__dirname, 'src/sprite/*.svg'),
        },

        // Output paths
        output: path.join(__dirname, 'dist/'),
    },
    demo: {
        // Source paths
        src: {
            sass: path.join(__dirname, 'demo/src/sass/**/*.scss'),
            js: path.join(__dirname, 'demo/src/js/**/*.js'),
        },

        // Output paths
        output: path.join(__dirname, 'demo/dist/'),

        // Demo
        root: path.join(__dirname, 'demo/'),
    },
    upload: [
        path.join(__dirname, `dist/*${minSuffix}.*`),
        path.join(__dirname, 'dist/*.css'),
        path.join(__dirname, 'dist/*.svg'),
        path.join(__dirname, `demo/dist/*${minSuffix}.*`),
        path.join(__dirname, 'demo/dist/*.css'),
        path.join(__dirname, 'demo/dist/*.svg'),
    ],
};

// Task arrays
const tasks = {
    css: [],
    js: [],
    sprite: [],
    clean: 'clean',
};

// Size plugin
const sizeOptions = { showFiles: true, gzip: true };

// Clean out /dist
gulp.task(tasks.clean, done => {
    const dirs = [paths.plyr.output, paths.demo.output].map(dir => path.join(dir, '**/*'));

    // Don't delete the mp4
    dirs.push(`!${path.join(paths.plyr.output, '**/*.mp4')}`);

    del(dirs);

    done();
});

// JavaScript
Object.entries(build.js).forEach(([filename, entry]) => {
    const { dist, formats, namespace, polyfill, src } = entry;

    formats.forEach(format => {
        const name = `js:${filename}:${format}`;
        const extension = format === 'es' ? 'mjs' : 'js';
        tasks.js.push(name);

        gulp.task(name, () =>
            gulp
                .src(src)
                .pipe(plumber())
                .pipe(sourcemaps.init())
                .pipe(
                    rollup(
                        {
                            plugins: [
                                resolve(),
                                commonjs(),
                                babel({
                                    presets: [
                                        [
                                            '@babel/env',
                                            {
                                                // debug: true,
                                                useBuiltIns: polyfill ? 'usage' : false,
                                                corejs: polyfill ? 3 : undefined,
                                            },
                                        ],
                                    ],
                                    babelrc: false,
                                    exclude: [/\/core-js\//],
                                }),
                            ],
                        },
                        {
                            name: namespace,
                            format,
                        },
                    ),
                )
                .pipe(header('typeof navigator === "object" && ')) // "Support" SSR (#935)
                .pipe(
                    rename({
                        extname: `.${extension}`,
                    }),
                )
                .pipe(gulp.dest(dist))
                .pipe(filter(`**/*.${extension}`))
                .pipe(terser())
                .pipe(rename({ suffix: minSuffix }))
                .pipe(size(sizeOptions))
                .pipe(sourcemaps.write(''))
                .pipe(gulp.dest(dist)),
        );
    });
});

// CSS
Object.entries(build.css).forEach(([filename, entry]) => {
    const { dist, src } = entry;
    const name = `css:${filename}`;
    tasks.css.push(name);

    gulp.task(name, () =>
        gulp
            .src(src)
            .pipe(plumber())
            .pipe(sass())
            .pipe(
                prefix(browsers, {
                    cascade: false,
                }),
            )
            .pipe(clean())
            .pipe(size(sizeOptions))
            .pipe(gulp.dest(dist)),
    );
});

// SVG Sprites
Object.entries(build.sprite).forEach(([filename, entry]) => {
    const { dist, src } = entry;
    const name = `sprite:${filename}`;
    tasks.sprite.push(name);

    gulp.task(name, () =>
        gulp
            .src(src)
            .pipe(plumber())
            .pipe(
                imagemin([
                    imagemin.svgo({
                        plugins: [{ removeViewBox: false }],
                    }),
                ]),
            )
            .pipe(svgstore())
            .pipe(rename({ basename: path.parse(filename).name }))
            .pipe(size(sizeOptions))
            .pipe(gulp.dest(dist)),
    );
});

// Build all JS
gulp.task('js', () => gulp.parallel(...tasks.js));

// Watch for file changes
gulp.task('watch', () => {
    // Plyr core
    gulp.watch(paths.plyr.src.js, gulp.parallel(...tasks.js));
    gulp.watch(paths.plyr.src.sass, gulp.parallel(...tasks.css));
    gulp.watch(paths.plyr.src.sprite, gulp.parallel(...tasks.sprite));

    // Demo
    gulp.watch(paths.demo.src.js, gulp.parallel(...tasks.js));
    gulp.watch(paths.demo.src.sass, gulp.parallel(...tasks.css));
});

// Serve via browser sync
gulp.task('serve', () =>
    browserSync.init({
        server: {
            baseDir: paths.demo.root,
        },
        notify: false,
        watch: true,
        ghostMode: false,
    }),
);

// Build distribution
gulp.task('build', gulp.series(tasks.clean, gulp.parallel(...tasks.js, ...tasks.css, ...tasks.sprite)));

// Default gulp task
gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));

// Publish a version to CDN and demo
// --------------------------------------------
// Get deployment config
let credentials = {};
try {
    credentials = require('./credentials.json'); //eslint-disable-line
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
            'Cache-Control': `max-age=${maxAge}`,
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

const regex =
    '(?:0|[1-9][0-9]*)\\.(?:0|[1-9][0-9]*).(?:0|[1-9][0-9]*)(?:-[\\da-z\\-]+(?:.[\\da-z\\-]+)*)?(?:\\+[\\da-z\\-]+(?:.[\\da-z\\-]+)*)?';
const semver = new RegExp(`v${regex}`, 'gi');
const localPath = new RegExp('(../)?dist', 'gi');
const versionPath = `https://${deploy.cdn.domain}/${version}`;
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

    log(`Uploading ${ansi.green.bold(version)} to ${ansi.cyan(domain)}...`);

    // Replace versioned URLs in source
    const files = ['plyr.js', 'plyr.polyfilled.js', 'config/defaults.js'];

    return gulp
        .src(
            files.map(file => path.join(__dirname, `src/js/${file}`)),
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
                list.push(`${versionPath}/${filename.replace(minSuffix, '')}`);
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

    // Replace versioned files in readme.md
    gulp.src([`${__dirname}/readme.md`])
        .pipe(replace(cdnpath, `${domain}/${version}/`))
        .pipe(gulp.dest(__dirname));

    // Replace local file paths with remote paths in demo HTML
    // e.g. "../dist/plyr.js" to "https://cdn.plyr.io/x.x.x/plyr.js"
    const index = `${paths.demo.root}index.html`;
    const error = `${paths.demo.root}error.html`;
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

gulp.task('error', done => {
    // Only update CDN for master (prod)
    if (!canDeploy() || branch.current !== branch.master) {
        done();
        return null;
    }

    const { publisher } = deploy.cdn;

    if (!publisher) {
        throw new Error('No publisher instance. Check AWS configuration.');
    }

    // Replace local file paths with remote paths in demo HTML
    // e.g. "../dist/plyr.js" to "https://cdn.plyr.io/x.x.x/plyr.js"
    // Upload error.html to cdn
    return gulp
        .src(`${paths.demo.root}error.html`)
        .pipe(replace(localPath, versionPath))
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
gulp.task(
    'deploy',
    gulp.series(
        'version',
        tasks.clean,
        gulp.parallel(...tasks.js, ...tasks.css, ...tasks.sprite),
        'cdn',
        'demo',
        'purge',
        'open',
    ),
);
