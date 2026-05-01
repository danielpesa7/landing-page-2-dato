// Optimize team headshots: read high-res sources from `assets/originals/`,
// resize to 400x400, and emit mozjpeg + WebP into `assets/`.
//
// Idempotent: always reads from `assets/originals/` so re-runs do not stack
// generation loss. To re-tune output quality, edit constants below and re-run.
//
// Display target: 56px circular avatar — 400px covers retina up to ~7x DPR.
// Run with: npm run images:optimize

import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assets = resolve(__dirname, '..', 'assets');
const originals = resolve(assets, 'originals');

const photos = ['daniel-perico', 'tomas-cardenas', 'david-ardila'];
const SIZE = 400;
const JPG_QUALITY = 82;
const WEBP_QUALITY = 80;

for (const name of photos) {
    const src = await readFile(resolve(originals, `${name}.jpg`));
    const base = sharp(src).resize(SIZE, SIZE, { fit: 'cover', position: 'attention' });

    const jpg = await base
        .clone()
        .jpeg({ quality: JPG_QUALITY, mozjpeg: true, progressive: true })
        .toBuffer();
    await writeFile(resolve(assets, `${name}.jpg`), jpg);

    const webp = await base.clone().webp({ quality: WEBP_QUALITY, effort: 6 }).toBuffer();
    await writeFile(resolve(assets, `${name}.webp`), webp);

    console.log(
        `${name}: jpg ${(jpg.length / 1024).toFixed(1)} KB, webp ${(webp.length / 1024).toFixed(1)} KB`
    );
}
