/* eslint-disable import/no-extraneous-dependencies */
// ==========================================================================
// Gulp build script
// ==========================================================================
/* eslint no-console: "off" */

const path = require('path');
const gulp = require('gulp');
// JavaScript
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
// CSS
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const clean = require('postcss-clean');
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
const gulpIf = require('gulp-if');
// Configs
const build = require('../build.json');
// Paths
const root = path.join(__dirname, '..');
const paths = {
  plyr: {
    output: path.join(root, 'dist/'),
  },
  demo: {
    output: path.join(root, 'demo/dist/'),
  },
};

// Task lists
const tasks = {
  css: [],
  js: [],
  sprite: [],
};

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
    const extension = 'js';
    tasks.js.push(name);

    gulp.task(name, () =>
      gulp
        .src(src)
        .pipe(plumber())
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
                  plugins: ['@babel/plugin-proposal-class-properties'],
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
      .pipe(postcss([customprops(), autoprefixer(), clean({ format: 'beautify' })]))
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
      .pipe(gulp.dest(dist)),
  );
});

// Build all tasks
gulp.task('js', gulp.parallel(...tasks.js));
gulp.task('css', gulp.parallel(...tasks.css));
gulp.task('sprites', gulp.parallel(...tasks.sprite));

// Build distribution
gulp.task('build', gulp.series('clean', gulp.parallel('js', 'css', 'sprites')));
