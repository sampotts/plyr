import { defineConfig } from 'vite-plus';

const ignorePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.vercel/**',
  '**/.server/**',
  '**/.vite-hooks/**',
  '**/*.svg',
  'pnpm-lock.yaml',
];

export default defineConfig({
  lint: {
    ignorePatterns: [...ignorePatterns, 'src/js/plyr.d.ts', 'site/src/vite-env.d.ts'],
    env: { browser: true, node: true },
    globals: { Hls: 'readonly', jQuery: 'readonly', Plyr: 'readonly' },
    options: { typeAware: false, typeCheck: false },
  },
  fmt: {
    // CHANGELOG.md is written by release-please in its own style.
    ignorePatterns: [...ignorePatterns, 'CHANGELOG.md'],
    singleQuote: true,
    semi: true,
    printWidth: 120,
    tabWidth: 2,
    trailingComma: 'all',
    sortTailwindcss: { stylesheet: './site/src/site.css' },
  },
  // Pre-commit (see .vite-hooks/pre-commit): lint and format the staged files.
  staged: {
    '*': 'vp check --fix --no-error-on-unmatched-pattern',
  },
});
