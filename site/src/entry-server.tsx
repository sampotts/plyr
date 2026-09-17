// Renders the page to static HTML at build time (see scripts/build.ts).
import { renderToString } from 'preact-render-to-string';
import { App } from './app';
import { poster } from './player';

export function render(): { head: string; html: string } {
  // Preload the poster so it starts downloading before the bundle runs (React 19 emitted this hint itself).
  const head = `<link rel="preload" as="image" href="${poster}" />`;
  return { head, html: renderToString(<App />) };
}
