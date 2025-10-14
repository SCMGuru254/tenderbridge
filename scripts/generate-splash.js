const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  'mdpi': 200,
  'hdpi': 300,
  'xhdpi': 400,
  'xxhdpi': 600,
  'xxxhdpi': 800
};

const orientations = ['port', 'land'];

async function generateSplashScreens(sourceImage) {
  const basePath = path.join(__dirname, '../android/app/src/main/res');
  
  for (const orientation of orientations) {
    for (const [density, size] of Object.entries(sizes)) {
      const targetDir = path.join(basePath, `drawable-${orientation}-${density}`);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const width = orientation === 'port' ? size : size * 1.5;
      const height = orientation === 'port' ? size * 1.5 : size;

      await sharp(sourceImage)
        .resize({
          width: width,
          height: height,
          fit: 'contain',
          background: { r: 26, g: 26, b: 26, alpha: 1 }
        })
        .toFile(path.join(targetDir, 'splash.png'));
    }
  }
}

// Usage
const sourceLogo = path.join(__dirname, '../src/assets/logo.png');
generateSplashScreens(sourceLogo)
  .then(() => console.log('Splash screens generated successfully'))
  .catch(console.error);