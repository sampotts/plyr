import { defineConfig } from 'vite-plus';

const ignorePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.vercel/**',
  '**/.server/**',
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
    ignorePatterns,
    singleQuote: true,
    semi: true,
    printWidth: 120,
    tabWidth: 2,
    trailingComma: 'all',
    sortTailwindcss: { stylesheet: './site/src/site.css' },
  },
});
