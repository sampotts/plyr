// ==========================================================================
// Build the player into dist/
// JavaScript: ES module and UMD bundles, plain and polyfilled (adds the CustomEvent and URL polyfills), each also
// minified with a source map.
// CSS: compiled Sass with custom properties resolved. SVG: the icon sprite.
// ==========================================================================

import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcss from 'postcss';
import customProperties from 'postcss-custom-properties';
import { compileAsync, type Options } from 'sass';
import { build } from 'vite-plus';
import { createSprite } from './sprite.ts';

const sassOptions: Options<'async'> = {
  silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'mixed-decls'],
};

await mkdir('dist', { recursive: true });
for (const file of await readdir('dist')) {
  if (!file.endsWith('.mp4')) await rm(join('dist', file), { recursive: true, force: true });
}

for (const polyfilled of [false, true]) {
  const name = polyfilled ? 'plyr.polyfilled' : 'plyr';
  for (const format of ['es', 'umd'] as const) {
    for (const minify of [false, true]) {
      const extension = format === 'es' ? 'mjs' : 'js';
      await build({
        configFile: false,
        publicDir: false,
        build: {
          outDir: 'dist',
          emptyOutDir: false,
          // ES2019 matches the syntax of the previously published builds: classes, arrow functions, async/await and
          // template literals are kept, while class fields, `??` and `?.` are lowered for older Safari releases.
          // Oxc handles the lowering. The `browserslist` in package.json is used by Autoprefixer for the CSS.
          target: 'es2019',
          minify: minify ? 'terser' : false,
          sourcemap: minify,
          lib: {
            entry: `src/js/${name}.js`,
            name: 'Plyr',
            formats: [format],
            fileName: () => `${name}${minify ? '.min' : ''}.${extension}`,
          },
          rolldownOptions: {
            output: { banner: format === 'umd' ? 'typeof navigator === "object" && ' : '' },
          },
        },
      });
    }
  }
}

const { css } = await compileAsync('src/sass/plyr.scss', sassOptions);
const result = await postcss([customProperties(), autoprefixer(), cssnano({ preset: 'default' })]).process(css, {
  from: 'src/sass/plyr.scss',
  to: 'dist/plyr.css',
  map: false,
});
await writeFile('dist/plyr.css', result.css);
await writeFile('dist/plyr.svg', await createSprite());
