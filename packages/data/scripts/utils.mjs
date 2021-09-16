import fs from 'fs'
import path from 'path'
import prettier from 'prettier'
import { spawn } from 'child_process'
import cliProgress from 'cli-progress'
import { CONFIG } from './CONFIG.mjs'

export const pipe = (...fns) => initialVal => fns.reduce((acc, fn) => fn(acc), initialVal)
export const pluck = key => obj => obj[key] || null
export const map = fn => item => fn(item)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

export function delay(delaySecond = getRandomInt(1, 2)) {
  return new Promise(resolve => {
    setTimeout(() => resolve(delaySecond), delaySecond * 1000)
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

export class CliProgress {
  constructor() {
    if (!CliProgress.instance) {
      CliProgress.instance = new cliProgress.MultiBar(
        {
          clearOnComplete: false,
          hideCursor: true,
        },
        cliProgress.Presets.shades_grey
      )
    }
  }

  getInstance() {
    return CliProgress.instance
  }
}

export function logCount(exchanges) {
  const maxExchangeLength = Math.max(...Object.keys(exchanges).map(k => k.length))
  Object.entries(exchanges).forEach(([exchange, { list }]) => {
    console.log(`${exchange.padEnd(maxExchangeLength, ' ')} >> ${Object.keys(list).length}`)
  })
}

export async function gitCommand(...command) {
  return new Promise(function (resolve, reject) {
    const process = spawn('git', [...command])

    process.on('close', function (code) {
      resolve(code)
    })

    process.on('error', function (err) {
      reject(err)
    })
  })
}

export function isSameWithPreviousData(newData, filePath = `${path.resolve()}/${CONFIG.humanOutput}`) {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data: oldData } = JSON.parse(fileContent)

  return JSON.stringify(oldData) === JSON.stringify(newData)
}

export async function commitChangesIfAny() {
  try {
    await gitCommand('add', 'stock-list*.json')
    await gitCommand('commit', '-m [STOCK_LIST] script_bot: Update with new changes')
  } catch (e) {
    console.error('Error commit', e)
    process.exit(1)
  }
}

export async function prettierJSON(str) {
  return prettier.format(str, { semi: false, parser: 'json' })
}

// https://stackoverflow.com/a/43688599/3648961
export function getElementByXPath(path) {
  return new XPathEvaluator().evaluate(path, document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue
}
