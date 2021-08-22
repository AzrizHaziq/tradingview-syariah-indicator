import fs from 'fs'

export const pipe = (...fn) => initialVal => fn.reduce((acc, fn) => fn(acc), initialVal)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}

export function delay(delay = getRandomInt(1, 2)) {
  return new Promise(resolve => {
    setTimeout(() => resolve(delay), delay * 1000)
  })
}

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
