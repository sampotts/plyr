// ==========================================================================
// Build the site: bundle the client, render the page to static HTML with
// React, and write the result into dist/index.html. Vercel serves dist/
// as a static site, so the page arrives fully rendered and React hydrates
// on top of it.
// ==========================================================================

import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'vite-plus';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = new URL('../dist/', import.meta.url);
const server = new URL('../.server/', import.meta.url);

// 1. Client bundle (dist/)
await build({ root, configFile: `${root}vite.config.ts`, logLevel: 'warn' });

// 2. Server bundle (.server/), used only to render the HTML below
await build({
  root,
  configFile: `${root}vite.config.ts`,
  logLevel: 'warn',
  // Bundle dependencies into the server build too, so the react -> preact/compat alias applies to @videojs/react.
  ssr: { noExternal: true },
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: fileURLToPath(server),
    emptyOutDir: true,
    sourcemap: false,
  },
});

// 3. Render and inject into the client template
const { render } = (await import(new URL('entry-server.js', server).href)) as typeof import('../src/entry-server');
const template = await readFile(new URL('index.html', dist), 'utf8');
const { head, html } = render();
const page = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
await writeFile(new URL('index.html', dist), page);
await rm(server, { recursive: true, force: true });

console.info(`Rendered dist/index.html (${html.length.toLocaleString()} characters of markup)`);
