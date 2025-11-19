const Jimp = require('jimp');
const pngToIco = require('png-to-ico');
const path = require('path');
const fs = require('fs');

async function make() {
  const outPng = path.join(process.cwd(), 'favicon-16.png');
  const outIco = path.join(process.cwd(), 'favicon.ico');

  // Create 16x16 blue background with white 'U'
  const image = new Jimp(16, 16, '#0b5cff');
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
  image.print(font, 0, -1, { text: 'U', alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, 16, 16);
  await image.writeAsync(outPng);

  const buf = await pngToIco(outPng);
  fs.writeFileSync(outIco, buf);
  // cleanup temporary png
  try { fs.unlinkSync(outPng); } catch (e) {}
  console.log('Generated favicon.ico');
}

make().catch((err) => {
  console.error('Failed to generate favicon:', err);
  process.exit(2);
});
