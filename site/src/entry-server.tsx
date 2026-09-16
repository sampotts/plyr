// Renders the page to static HTML at build time (see scripts/build.ts).
import { renderToString } from 'react-dom/server';
import { App } from './app';

export function render(): { head: string; html: string } {
  return { head: '', html: renderToString(<App />) };
}
