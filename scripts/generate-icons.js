const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  favicon: [16, 32, 48],
  android: [192, 512],
  ios: [1024],
};

async function generateIcons() {
  const sourceIcon = path.join(__dirname, '../assets/icon.png');
  
  // Generate favicon
  for (const size of sizes.favicon) {
    await sharp(sourceIcon)
      .resize(size, size)
      .toFile(path.join(__dirname, `../public/favicon-${size}x${size}.png`));
  }

  // Generate Android icons
  for (const size of sizes.android) {
    await sharp(sourceIcon)
      .resize(size, size)
      .toFile(path.join(__dirname, `../public/logo${size}.png`));
  }

  // Generate iOS icon
  await sharp(sourceIcon)
    .resize(1024, 1024)
    .toFile(path.join(__dirname, '../public/ios-icon.png'));
}

generateIcons().catch(console.error); 