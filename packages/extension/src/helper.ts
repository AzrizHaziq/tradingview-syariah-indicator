import type { StorageMap } from '@app/type'
import browser from 'webextension-polyfill'

let SHARIAH_LIST: Map<`${string}:${string}`, Record<string, number>> = new Map()
export const attributeName = 'data-indicator'
export const extensionName = 'tradingview-shariah-indicator'

export async function setStockListInMap(): Promise<void> {
  try {
    const LIST = await getStorage('LIST')
    const DATA_SOURCE = await getStorage('DATASOURCE')

    if (DATA_SOURCE === 'default') {
      SHARIAH_LIST = new Map(LIST)
    }

    if (DATA_SOURCE === 'merge') {
      const MERGE_LIST = (await getStorage('DATASOURCE_MERGE')) ?? []
      SHARIAH_LIST = new Map(
        [].concat(LIST, MERGE_LIST, [
          // for test
          // ['MYX:MAYBANK', { s: 1 }], // my bank
          // ['NASDAQ:GOOG', { s: 1 }], // nasdaq google
          // ['TSX:RY', { s: 1 }], // canada bank
        ])
      )
    }

    if (DATA_SOURCE === 'own') {
      const OWN_LIST = await getStorage('DATASOURCE_OWN')
      SHARIAH_LIST = new Map(OWN_LIST)
    }

    console.log('Tradingview Shariah  >>>', Object.fromEntries(SHARIAH_LIST))
  } catch (e) {
    console.warn(`Tradingview Shariah Indicator: Please refresh the browser, Error:`, e)
  }
}

export function getStockStat(symbolWithExchange: `${string}:${string}`, defaultReturn = {}): Record<string, number> {
  return SHARIAH_LIST.has(symbolWithExchange) ? SHARIAH_LIST.get(symbolWithExchange) : defaultReturn
}

export function isShariahIconExist(element: Element): Element | null {
  return element.querySelector(`[${attributeName}="${extensionName}"]`)
}

export function deleteShariahIcon(parentElement: Element | Document = document): void {
  parentElement.querySelectorAll(`[${attributeName}="${extensionName}"]`).forEach((img) => img.remove())
}

export function createIcon({ width, height } = { width: 25, height: 25 }): HTMLImageElement {
  const img = document.createElement('img')
  img.src = browser.runtime.getURL('assets/shariah-icon.svg')
  img.alt = 'Tradingview shariah icon'
  img.setAttribute(attributeName, extensionName)
  img.width = width
  img.height = height

  return img
}

export function addStyle(css: string): void {
  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(css))
  head.appendChild(style)
}

export function debounce<T>(func: (...unknown) => void, wait: number, immediate: boolean): (...args: T[]) => void {
  let timeout

  return function executedFunction(...args: T[]) {
    const context = this // eslint-disable-line @typescript-eslint/no-this-alias
    // const args = arguments // eslint-disable-line prefer-rest-params

    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, (wait = 500))

    if (callNow) func.apply(context, args)
  }
}

export function observeNodeChanges(
  nodeToObserve: Element,
  cb: () => unknown,
  options: Partial<MutationObserverInit> = { childList: true, subtree: true }
): () => void {
  // eslint-disable-next-line prefer-const
  let observer: MutationObserver

  if (observer) {
    console.log(`Already observe changes`)
    observer.disconnect()
  }

  observer = new MutationObserver(cb)

  observer.observe(nodeToObserve, options)

  return () => observer.disconnect()
}

export function waitForElm<T = Element>(selector: string): Promise<T> {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      // @ts-ignore
      return resolve(document.querySelector(selector))
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        // @ts-ignore
        resolve(document.querySelector(selector))
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}

export function getMessage(messageName: string, substitutions?: Parameters<typeof browser.i18n.getMessage>[1]): string {
  return browser.i18n.getMessage(messageName, substitutions)
}

export async function setStorage<K extends keyof StorageMap>(key: K, payload: StorageMap[K]): Promise<void> {
  try {
    await browser.storage.local.set({ [key]: payload })
  } catch (e) {
    console.error(`Error set ${key} in storage`, e)
  }
}

export async function getStorage<K extends keyof StorageMap>(key: K): Promise<StorageMap[K]> {
  try {
    const { [key]: data } = await browser.storage.local.get(key)
    return data
  } catch (e) {
    console.error(`Error set ${key} in storage`, e)
  }
}

export async function delay(ms = 1000): Promise<void> {
  return new Promise((res) => setTimeout(res, ms))
}

export function required<T>(s): T {
  if (s.length === 0) {
    throw { msg: 'required input ' }
  }

  return s
}

export function isFormatCorrect<T>(s): T {
  if (Array.isArray(s)) {
    s.forEach(([stockCode, obj]) => {
      const split = stockCode.split(':')

      if (split.length !== 2) throw { msg: `${stockCode}: need to satisfy "market:stockCode"` }
      if (!Object.hasOwn(obj, 's')) throw { msg: `${stockCode}: doesnt have "s = 0 or 1"` }
      if (!(obj.s === 1 || obj.s === 0)) throw { msg: `${stockCode}: "s" valid is either 0 or 1` }
    })
  }

  return s
}

export function isValidJson<T>(a: string): T {
  try {
    return JSON.parse(a)
  } catch (e) {
    throw { msg: 'wrong json format' }
  }
}
