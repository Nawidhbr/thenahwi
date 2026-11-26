/**
 * Makes the smaller sizes of every photo in public/photos/ from its 1600-wide original (<slug>-1600.webp):
 * 160, 320 and 480 wide as WebP, and every size (160 to 1600) also as AVIF, which is about a third smaller.
 * `components/Photo.astro` offers them with srcset, so a thumbnail loads a thumbnail. Run after adding photos:
 *   node apps/web/scripts/make-photos.cjs
 * (not part of the build; the files are committed).
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "public", "photos");
const SIZES = [160, 320, 480, 800, 1600];
(async () => {
  let made = 0;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith("-1600.webp"));
  // Four photos at a time.
  const work = async (f) => {
    const slug = f.replace(/-1600\.webp$/, "");
    const src = path.join(dir, f);
    for (const w of SIZES) {
      const webp = path.join(dir, `${slug}-${w}.webp`);
      const avif = path.join(dir, `${slug}-${w}.avif`);
      if (!fs.existsSync(webp)) { await sharp(src).resize({ width: w }).webp({ quality: 72 }).toFile(webp); made++; }
      if (!fs.existsSync(avif)) { await sharp(src).resize({ width: w }).avif({ quality: 50, effort: 2 }).toFile(avif); made++; }
    }
  };
  for (let i = 0; i < files.length; i += 4) await Promise.all(files.slice(i, i + 4).map(work));
  console.log(`made ${made} files`);
})();
