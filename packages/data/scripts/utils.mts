import fs from 'node:fs'
import path from 'node:path'
import colors from 'colors'
import prettier from 'prettier'
import { spawn } from 'child_process'
import cliProgress from 'cli-progress'
import { CONFIG } from './CONFIG.mjs'

export const pipe =
  (...fns) =>
  (initialVal) =>
    fns.reduce((acc, fn) => fn(acc), initialVal)

export const pluck =
  <T, K extends keyof T>(key: K) =>
  (obj: T): T[K] | null =>
    obj[key] || null

export const map =
  <T, R>(fn: (a: T) => R) =>
  (item: T): R =>
    fn(item)

export function getRandomInt(min, max): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

export function delay(delaySecond = getRandomInt(1, 2)): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(delaySecond), delaySecond * 1000)
  })
}

export async function writeToFile(filename: string, data: string) {
  try {
    fs.writeFileSync(filename, data, { encoding: 'utf-8' }, function (e) {
      if (e) {
        console.log('Error writeToFile', e)
        throw Error(`Unable to writeToFile`, { cause: e })
      }
    })

    console.log(`Saved in: ${filename}`)
  } catch (e) {
    console.error('Error write data', e)
    process.exit(1)
  }
}

export class CliProgress {
  static instance

  constructor() {
    if (!CliProgress.instance) {
      CliProgress.instance = new cliProgress.MultiBar(
        {
          clearOnComplete: false,
          hideCursor: true,
        },
        {
          format: colors.yellow(' {bar} ') + '{percentage}% | ETA: {eta}s | {value}/{total} {stats}',
          barCompleteChar: '\u2588',
          barIncompleteChar: '\u2591',
        }
      )
    }
  }

  getInstance() {
    return CliProgress.instance
  }
}

export function logCount(exchanges) {
  const maxExchangeLength = Math.max(...Object.keys(exchanges).map((k) => k.length))
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

export function isSameWithPreviousData(newData, filePath = `${path.resolve()}/${CONFIG.humanOutput}`): boolean {
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

export async function prettierJSON(str: string): Promise<string> {
  return prettier.format(str, { semi: false, parser: 'json' })
}
