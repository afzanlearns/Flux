const sharp = require('sharp')
const path = require('path')

const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
]

const accent = '#BE185D'
const bgLight = '#FAFAFA'

const svgIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="#831843"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#bg)"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="system-ui, sans-serif" font-weight="700"
        font-size="${size * 0.55}px" fill="white">F</text>
</svg>`

async function main() {
  const outDir = path.join(__dirname, '..', 'public', 'icons')

  for (const { size, name } of sizes) {
    const svg = svgIcon(size)
    const buf = Buffer.from(svg)

    await sharp(buf)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, name))

    console.log(`Generated ${name} (${size}x${size})`)
  }
}

main().catch(console.error)
