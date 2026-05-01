// Optimize team headshots in `assets/` to a 400x400 square in WebP + JPG.
// Display target: 56px circular avatar (proto) — 400px covers retina up to 7x DPR.
// Run with: npm run images:optimize

import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assets = resolve(__dirname, '..', 'assets');

const photos = ['daniel-perico', 'tomas-cardenas', 'david-ardila'];
const SIZE = 400;

for (const name of photos) {
    const src = await readFile(resolve(assets, `${name}.jpg`));
    const base = sharp(src).resize(SIZE, SIZE, { fit: 'cover', position: 'attention' });

    const jpg = await base
        .clone()
        .jpeg({ quality: 82, mozjpeg: true, progressive: true })
        .toBuffer();
    await writeFile(resolve(assets, `${name}.jpg`), jpg);

    const webp = await base.clone().webp({ quality: 80, effort: 6 }).toBuffer();
    await writeFile(resolve(assets, `${name}.webp`), webp);

    console.log(
        `${name}: jpg ${(jpg.length / 1024).toFixed(1)} KB, webp ${(webp.length / 1024).toFixed(1)} KB`
    );
}
