import fs from 'fs'
import path from 'path'
import fse from 'fs-extra'
import pkg from './package.json'

/**
 * This script is for uploading source code to Firefox submission.
 * This script run after `npm run build`.
 * It will compile all `files` below and write a README.md.
 * Then it will zip it with `sourceFolder` name.
 * The output can be found at /web-ext-artifacts.
 */
const sourceFolder = `firefox-tsi-${pkg.version}`
const outputZip = `${sourceFolder}-source-code.zip`
const files = [
  '_locales',
  'assets',
  'src',
  '.babelrc',
  '.env.example',
  'globals.d.ts',
  'manifest.firefox.json',
  'package.json',
  'postcss.config.js',
  'windi.config.ts',
  'tsconfig.json',
  'webpack.config.ts',
].map((file) => copy(file))

async function copy(input, dest = sourceFolder) {
  try {
    return await fse.copy(path.resolve(process.cwd(), input), path.resolve(process.cwd(), dest, input), {
      overwrite: true,
    })
  } catch (err) {
    console.error(`Failed to copy: ${input}`, err)
    process.exit(1)
  }
}

async function createReadme() {
  try {
    const readme = `
## Tradingview Shariah Indicator (${pkg.version})
Requirements
- node = 16.9.1
- pnpm = 6.24.1
- git = 2.31.0

Steps
1. Git clone \`git@github.com:AzrizHaziq/tradingview-syariah-indicator.git\`
2. cd tradingview-shariah-indicator && pnpm install
3. cd packages/extension
3. create \`.env.production\` file in root, and add this
   \`\`\`
   FETCH_URL=https://raw.githubusercontent.com/AzrizHaziq/tradingview-syariah-indicator/master/packages/data/stock-list.json
   \`\`\`
4. Type in terminal \`$ npm run ff:build\`
5. Generated file located in /dist/*
`.trim()

    fs.writeFileSync(`${sourceFolder}/README.md`, readme, {
      encoding: 'utf-8',
    })

    // eslint-disable-next-line no-console
    console.log(`Success write to README.md`)
  } catch (e) {
    throw new Error(`Error create README.md: ${e}`)
  }
}

async function gzip() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const child_process = require('child_process')

    child_process.execSync(`zip -r ./${outputZip} ./${sourceFolder}`)
    child_process.execSync(`rm -rf ./${sourceFolder}`)
    child_process.execSync(`mv ./${outputZip} ./web-ext-artifacts/`)

    // eslint-disable-next-line no-console
    console.log(`Success zip to ${outputZip}`)
  } catch (e) {
    throw new Error(`Error zip folder: ${e}`)
  }
}

Promise.all(files)
  .then(() => console.log(`\nsuccess copy to ${sourceFolder}`))
  .then(createReadme)
  .then(gzip)
