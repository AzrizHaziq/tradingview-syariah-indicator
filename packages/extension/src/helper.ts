import type { StorageMap } from '@app/shared'
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
