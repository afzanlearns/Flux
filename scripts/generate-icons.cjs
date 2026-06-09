const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
]

async function main() {
  const outDir = path.join(__dirname, '..', 'public', 'icons')

  for (const { size, name } of sizes) {
    const svgPath = path.join(outDir, name.replace('.png', '.svg'))
    const svg = fs.readFileSync(svgPath, 'utf8')

    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, name))

    console.log(`Generated ${name} (${size}x${size})`)
  }
}

main().catch(console.error)
