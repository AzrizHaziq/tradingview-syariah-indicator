import fs from 'fs'
import path from 'path'
import glob from 'glob-fs'
import fse from 'fs-extra'
import { minify } from 'terser'

const destination = 'temp-dist'
const files = ['manifest.json', 'src', 'assets', '_locales'].map(file => copy(file))

async function copy(input, dest = destination) {
  try {
    return await fse.copy(path.resolve(process.cwd(), input), path.resolve(process.cwd(), dest, input), {
      overwrite: true,
    })
  } catch (err) {
    console.error(`Failed to copy: ${input}`, err)
    process.exit(1)
  }
}

async function terser() {
  const files = glob({ gitignore: false }).readdirSync(`temp-dist/**/*.js`)

  for (const file of files) {
    const { code } = await minify(
      {
        [file]: fs.readFileSync(file, 'utf8'),
      },
      {
        ecma: 2015,
        compress: {
          global_defs: {
            PRODUCTION: true,
          },
        },
      }
    )

    fs.writeFileSync(file, code, 'utf8')
  }
}

Promise.all(files)
  .then(() => console.log(`success copy to ${destination}`))
  .then(terser)
  .then(() => console.log(`done minify & uglify`))
