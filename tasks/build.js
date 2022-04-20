/* eslint-disable import/no-extraneous-dependencies */
// ==========================================================================
// Gulp build script
// ==========================================================================
/* eslint no-console: "off" */

const path = require('path');
const gulp = require('gulp');
// JavaScript
const terser = require('gulp-terser');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
// CSS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const customprops = require('postcss-custom-properties');
// Images
const svgstore = require('gulp-svgstore');
const imagemin = require('gulp-imagemin');
// Utils
const del = require('del');
const filter = require('gulp-filter');
const header = require('gulp-header');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
// Configs
const build = require('../build.json');
// Info from package
const minSuffix = '.min';
// Paths
const root = path.join(__dirname, '..');
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
};

// Task lists
const tasks = {
  css: [],
  js: [],
  sprite: [],
};

// Size plugin
const sizeOptions = { showFiles: true, gzip: true };

// Clean out /dist
gulp.task('clean', (done) => {
  const dirs = [paths.plyr.output, paths.demo.output].map((dir) => path.join(dir, '**/*'));

  // Don't delete the mp4
  dirs.push(`!${path.join(paths.plyr.output, '**/*.mp4')}`);

  del(dirs);

  done();
});

// JavaScript
Object.entries(build.js).forEach(([filename, entry]) => {
  const { dist, formats, namespace, polyfill, src } = entry;

  formats.forEach((format) => {
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
                        bugfixes: true,
                      },
                    ],
                  ],
                  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-optional-chaining'],
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
        .pipe(gulpIf(() => extension !== 'mjs', header('typeof navigator === "object" && '))) // "Support" SSR (#935)
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
        postcss([
          customprops(),
          autoprefixer(),
          cssnano({
            preset: 'default',
          }),
        ]),
      )
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

// Build all tasks
gulp.task('js', gulp.parallel(...tasks.js));
gulp.task('css', gulp.parallel(...tasks.css));
gulp.task('sprites', gulp.parallel(...tasks.sprite));

// Watch for file changes
gulp.task('watch', () => {
  // Plyr core
  gulp.watch(paths.plyr.src.js, gulp.parallel('js'));
  gulp.watch(paths.plyr.src.sass, gulp.parallel('css'));
  gulp.watch(paths.plyr.src.sprite, gulp.parallel('sprites'));

  // Demo
  gulp.watch(paths.demo.src.js, gulp.parallel('js'));
  gulp.watch(paths.demo.src.sass, gulp.parallel('css'));
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
gulp.task('build', gulp.series('clean', gulp.parallel('js', 'css', 'sprites')));

// Default gulp task
gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));
