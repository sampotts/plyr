import antfu from '@antfu/eslint-config';
import { FlatCompat } from '@eslint/eslintrc';

import globals from 'globals';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default antfu({
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
    svg: 'prettier',
  },
  stylistic: {
    semi: true,
    spacedComment: true,
    indent: 2,
    quotes: 'single',
  },
  ignores: ['node_modules', 'dist', 'src/js/plyr.d.ts'],
  languageOptions: {
    globals: {
      ...globals.browser,
      Hls: 'readonly',
      jQuery: 'readonly',
      Plyr: 'readonly',
    },
  },
}, ...compat.config({
  rules: {
    'antfu/if-newline': 'off',
  },
}, {
  files: ['**/*.md'],
  rules: {
    'style/max-len': 'off',
  },
}));
