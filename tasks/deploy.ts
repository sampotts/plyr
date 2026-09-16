// ==========================================================================
// Upload the built player (dist/) to cdn.plyr.io
// Run `pnpm build:player` first. Pass --dry-run to list the uploads without
// sending anything. Versions in source files are bumped by release-please.
// ==========================================================================

import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import mime from 'mime';
import 'dotenv/config';

interface DeployConfig {
  cdn: { type: string; bucket: string; domain: string };
}

const dryRun = process.argv.includes('--dry-run');
const { version } = JSON.parse(await readFile('package.json', 'utf8')) as { version: string };
const { cdn } = JSON.parse(await readFile('deploy.json', 'utf8')) as DeployConfig;

let client: S3Client | undefined;

async function upload(key: string, body: string, cacheControl: string): Promise<void> {
  console.info(`${dryRun ? 'Would upload' : 'Uploading'} ${cdn.bucket}/${key}`);
  if (dryRun) return;

  const missing = ['CF_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'].filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);

  client ??= new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    },
  });

  await client.send(
    new PutObjectCommand({
      Bucket: cdn.bucket,
      Key: key,
      Body: body,
      ContentType: mime.getType(key) ?? 'application/octet-stream',
      CacheControl: cacheControl,
    }),
  );
}

const files = (await readdir('dist').catch(() => [] as string[])).filter(
  (file) => file.includes('.min.') || /\.(css|svg)$/.test(file),
);
if (!files.length) throw new Error('Nothing to upload: run `pnpm build:player` first.');

// Minified files are published without the `.min` suffix, e.g. https://cdn.plyr.io/3.8.4/plyr.js
for (const file of files) {
  const name = file.replace('.min.', '.');
  let body = await readFile(join('dist', file), 'utf8');
  body = body.replace(/sourceMappingURL=(\S+)/g, (_, url: string) => `sourceMappingURL=${url.replace('.min.', '.')}`);
  if (file.endsWith('.map')) {
    const map = JSON.parse(body) as { file?: string };
    if (map.file) map.file = map.file.replace('.min.', '.');
    body = JSON.stringify(map);
  }
  await upload(`${version}/${name}`, body, 'max-age=31536000, immutable');
}
