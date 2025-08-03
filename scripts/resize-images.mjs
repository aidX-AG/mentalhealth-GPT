import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const inputDir = 'public/images';
const sizes = [640, 1280, 1920];

const processImage = async (file) => {
  const ext = path.extname(file);
  const base = path.basename(file, ext);

  // Skip already resized images (e.g. hero-640.jpg)
  if (base.match(/-\d+$/)) return;

  const inputPath = path.join(inputDir, file);
  const buffer = await fs.readFile(inputPath);

  for (const width of sizes) {
    const outputPath = path.join(inputDir, `${base}-${width}${ext}`);
    await sharp(buffer)
      .resize({ width })
      .toFile(outputPath);
    console.log(`✓ ${outputPath}`);
  }
};

const run = async () => {
  const files = await fs.readdir(inputDir);
  const imageFiles = files.filter((f) =>
    /\.(jpe?g|png)$/i.test(f)
  );

  for (const file of imageFiles) {
    await processImage(file);
  }

  console.log('✔️  Alle Bilder wurden skaliert');
};

run().catch((err) => {
  console.error('❌ Fehler beim Verarbeiten:', err);
  process.exit(1);
});
