import fs from 'fs'

export async function writeToFile(filename, data) {
  try {
    fs.writeFileSync(filename, data, { encoding: 'utf-8' }, function (err) {
      if (err) {
        console.log(err)
        throw Error(`Unable to write to file ${filename}`)
      }
    })

    console.log(`Saved in: ${filename}`)
  } catch (e) {
    console.error('Error write data', e)
    process.exit(1)
  }
}
