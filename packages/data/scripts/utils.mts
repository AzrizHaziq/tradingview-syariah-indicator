import * as fs from 'fs'
import * as path from 'path'

import colors from 'colors'

import * as prettier from 'prettier'
import { spawn } from 'child_process'
import { MultiBar } from 'cli-progress'
import * as cliProgress from 'cli-progress'
import { CONFIG } from './config.mjs'

export const pipe =
  (...fns: any) =>
  (initialVal: any) =>
    fns.reduce((acc: any, fn: any) => fn(acc), initialVal)
export const pluck = (key: string) => (obj: any) => obj[key] || null
export const map = (fn: Function) => (item: any) => fn(item)

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

export function delay(delaySecond = getRandomInt(1, 2)) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(delaySecond), delaySecond * 1000)
  })
}

/**
 * @returns {void}
 */
export async function writeToFile(filename: string, data: string): Promise<void> {
  try {
    fs.writeFileSync(filename, data, { encoding: 'utf-8' })
    console.log(`Saved in: ${filename}`)
  } catch (e) {
    console.error('Error write data', e)
    process.exit(1)
  }
}

export class CliProgress {
  static instance: MultiBar

  constructor() {
    if (!CliProgress.instance) {
      CliProgress.instance = new cliProgress.MultiBar(
        {
          clearOnComplete: false,
          hideCursor: true,
        },
        {
          format: colors.yellow(' {bar} ') + '{percentage}% | ETA: {eta}s | {value}/{total} {stats}',
          // format: (' {bar} ') + '{percentage}% | ETA: {eta}s | {value}/{total} {stats}',
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

export function logCount(exchanges: {list: any}) {
  const maxExchangeLength = Math.max(...Object.keys(exchanges).map((k) => k.length))
  Object.entries(exchanges).forEach(([exchange, { list }]) => {
    console.log(`${exchange.padEnd(maxExchangeLength, ' ')} >> ${Object.keys(list).length}`)
  })
}

export async function gitCommand(...command: any[]) {
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

export function isSameWithPreviousData(newData: any, filePath = `${path.resolve()}/${CONFIG.humanOutput}`) {
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

// https://stackoverflow.com/a/43688599/3648961
export function getElementByXPath(path: string): Node | null {
  return new XPathEvaluator().evaluate(path, document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue
}
