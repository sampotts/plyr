// ==========================================================================
// Build the SVG sprite (dist/plyr.svg) from src/sprite/*.svg
// ==========================================================================

import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';
import svgstore from 'svgstore';

const directory = fileURLToPath(new URL('../src/sprite/', import.meta.url));

export async function createSprite(): Promise<string> {
  const sprite = svgstore();
  const files = (await readdir(directory)).filter((name) => name.endsWith('.svg')).sort();
  for (const file of files) {
    const source = await readFile(join(directory, file), 'utf8');
    const { data } = optimize(source);
    sprite.add(basename(file, '.svg'), data);
  }
  return sprite.toString();
}
