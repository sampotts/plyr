// ==========================================================================
// Gulp build script (ESM version)
// ==========================================================================

import { readFileSync } from 'node:fs';
import path, { join } from 'node:path';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import cssnano from 'cssnano';
import { deleteAsync } from 'del';
import gulp from 'gulp';
import rollup from 'gulp-better-rollup';
import filter from 'gulp-filter';
import header from 'gulp-header';
import gulpIf from 'gulp-if';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import svgstore from 'gulp-svgstore';
import terser from 'gulp-terser';
import imageminSvgo from 'imagemin-svgo';
import customprops from 'postcss-custom-properties';
import * as dartSass from 'sass';

const jobs = JSON.parse(readFileSync(join(path.resolve(), 'build.json'), 'utf-8'));

const bs = browserSync.create();
const sassCompiler = sass(dartSass);
const minSuffix = '.min';

// Paths
const root = path.resolve();
const paths = {
  plyr: {
    src: {
      sass: path.join(root, 'src/sass/**/*.scss'),
      js: path.join(root, 'src/js/**/*.js'),
      sprite: path.join(root, 'src/sprite/*.svg'),
    },
    output: path.join(root, 'dist/'),
  },
  demo: {
    src: {
      sass: path.join(root, 'demo/src/sass/**/*.scss'),
      js: path.join(root, 'demo/src/js/**/*.js'),
    },
    output: path.join(root, 'demo/dist/'),
    root: path.join(root, 'demo/'),
  },
};

// Task lists
const tasks = {
  css: [],
  js: [],
  sprite: [],
};

// Size plugin options
const sizeOptions = { showFiles: true, gzip: true };

// Clean task
export async function clean() {
  const dirs = [paths.plyr.output, paths.demo.output].map(dir => path.join(dir, '**/*'));
  dirs.push(`!${path.join(paths.plyr.output, '**/*.mp4')}`);
  return await deleteAsync(dirs);
};

// JavaScript tasks
Object.entries(jobs.js).forEach(([filename, entry]) => {
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
                  babelHelpers: 'bundled',
                  presets: [
                    [
                      '@babel/env',
                      {
                        useBuiltIns: polyfill ? 'usage' : false,
                        corejs: polyfill ? 3 : undefined,
                        bugfixes: true,
                      },
                    ],
                  ],
                  plugins: [
                    '@babel/plugin-proposal-class-properties',
                    '@babel/plugin-transform-nullish-coalescing-operator',
                    '@babel/plugin-proposal-optional-chaining',
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
        .pipe(gulpIf(() => extension !== 'mjs', header('typeof navigator === "object" && ')))
        .pipe(rename({ extname: `.${extension}` }))
        .pipe(gulp.dest(dist))
        .pipe(filter(`**/*.${extension}`))
        .pipe(terser())
        .pipe(rename({ suffix: minSuffix }))
        .pipe(size(sizeOptions))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(dist)));
  });
});

// CSS tasks
Object.entries(jobs.css).forEach(([filename, entry]) => {
  const { dist, src } = entry;
  const name = `css:${filename}`;
  tasks.css.push(name);

  gulp.task(name, () =>
    gulp
      .src(src)
      .pipe(plumber())
      .pipe(sassCompiler())
      .pipe(
        postcss([
          customprops(),
          autoprefixer(),
          cssnano({ preset: 'default' }),
        ]),
      )
      .pipe(size(sizeOptions))
      .pipe(gulp.dest(dist)));
});

// SVG Sprite tasks
Object.entries(jobs.sprite).forEach(([filename, entry]) => {
  const { dist, src } = entry;
  const name = `sprite:${filename}`;
  tasks.sprite.push(name);

  gulp.task(name, () =>
    gulp
      .src(src)
      .pipe(plumber())
      .pipe(
        imagemin([
          imageminSvgo({
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false, // Keep viewBox attribute
                  },
                },
              },
            ],
          }),
        ]),
      )
      .pipe(svgstore())
      .pipe(rename({ basename: path.parse(filename).name }))
      .pipe(size(sizeOptions))
      .pipe(gulp.dest(dist)));
});

// Build tasks
export const js = gulp.parallel(...tasks.js);
export const css = gulp.parallel(...tasks.css);
export const sprites = gulp.parallel(...tasks.sprite);

// Watch task
export function watch() {
  gulp.watch(paths.plyr.src.js, js);
  gulp.watch(paths.plyr.src.sass, css);
  gulp.watch(paths.plyr.src.sprite, sprites);
  gulp.watch(paths.demo.src.js, js);
  gulp.watch(paths.demo.src.sass, css);
}

// Serve task
export function serve() {
  return bs.init({
    server: {
      baseDir: paths.demo.root,
    },
    notify: false,
    watch: true,
    ghostMode: false,
  });
}

// Build distribution
export const build = gulp.series(clean, gulp.parallel(js, css, sprites));

// Default task
export default gulp.series(build, gulp.parallel(serve, watch));
