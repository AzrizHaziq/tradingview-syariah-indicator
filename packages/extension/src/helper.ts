import browser from 'webextension-polyfill'

let SHARIAH_LIST: Map<`${string}:${string}`, Record<string, number>> = new Map()
export const attributeName = 'data-indicator'
export const extensionName = 'tradingview-shariah-indicator'

export async function setStockListInMap(): Promise<void> {
  try {
    const LIST = await getStorage('LIST')
    SHARIAH_LIST = new Map(LIST)
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

export function createIcon({ width, height } = { width: 25, height: 25 }): HTMLElement {
  const iconInSvgString = `
   <svg viewBox="0 0 512 512" width="${width}" height="${height}" ${attributeName}="${extensionName}" xmlns="http://www.w3.org/2000/svg">
      <title>Icon made by Flaticon from www.flaticon.com"</title>
      <path d="m481.414062 387.503906c-46.253906 75.460938-129.484374 125.507813-224.226562 124.480469-142.894531-1.546875-257.1875-117.976563-257.1875-261.953125 0-115.910156 74.722656-214.253906 178.257812-248.757812 4.996094-1.664063 9.546876 3.523437 7.28125 8.308593-16.441406 34.6875-25.527343 73.601563-25.222656 114.691407 1.070313 144.238281 116.875 260 260.039063 260 18.78125 0 37.082031-2.007813 54.730469-5.832032 5.136718-1.113281 9.089843 4.554688 6.328124 9.0625zm0 0"
            fill="#2ecc71"/>
      <path d="m481.394531 387.53125c-6.792969 11.078125-14.378906 21.601562-22.679687 31.496094-9.984375 1.027344-20.101563 1.546875-30.355469 1.546875-164.023437 0-297.003906-133.980469-297.003906-299.226563 0-38.714844 7.300781-75.707031 20.578125-109.652344 8.53125-3.941406 17.308594-7.421874 26.304687-10.421874 5.007813-1.667969 9.570313 3.511718 7.300781 8.304687-16.394531 34.589844-25.476562 73.378906-25.226562 114.34375.878906 144.339844 116.777344 260.347656 260.046875 260.347656 18.78125 0 37.082031-2.007812 54.726563-5.828125 5.152343-1.117187 9.078124 4.570313 6.308593 9.089844zm0 0"
            fill="#27ae60"/>
      <path d="m389.464844 4.546875 26.585937 54.273437c1.179688 2.40625 3.457031 4.074219 6.09375 4.460938l59.449219 8.703125c6.640625.972656 9.289062 9.195313 4.484375 13.914063l-43.015625 42.246093c-1.90625 1.875-2.777344 4.574219-2.328125 7.222657l10.15625 59.648437c1.132813 6.664063-5.808594 11.746094-11.75 8.601563l-53.171875-28.164063c-2.355469-1.25-5.175781-1.25-7.535156 0l-53.167969 28.164063c-5.941406 3.144531-12.882813-1.9375-11.75-8.601563l10.15625-59.648437c.449219-2.648438-.421875-5.347657-2.328125-7.222657l-43.015625-42.246093c-4.804687-4.71875-2.15625-12.941407 4.484375-13.914063l59.449219-8.703125c2.636719-.386719 4.914062-2.054688 6.09375-4.460938l26.585937-54.273437c2.972656-6.0625 11.554688-6.0625 14.523438 0zm0 0"
            fill="#2ecc71"/>
      <path d="m443.066406 128.144531c-1.90625 1.871094-2.785156 4.574219-2.328125 7.222657l10.148438 59.65625c1.132812 6.660156-5.808594 11.738281-11.75 8.59375l-7.300781-3.867188-12.179688-71.570312c-.558594-3.234376.515625-6.527344 2.847656-8.824219l49.648438-48.753907 9.433594 1.382813c6.644531.976563 9.292968 9.195313 4.488281 13.914063zm0 0"
            fill="#27ae60"/>
  </svg>
  `
  const span = document.createElement('span')
  span.innerHTML = iconInSvgString
  return span
}

export function addStyle(css: string): void {
  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(css))
  head.appendChild(style)
}

export function debounce(func: (...unknown) => void, wait: number, immediate: boolean): () => void {
  let timeout

  return function executedFunction() {
    const context = this // eslint-disable-line @typescript-eslint/no-this-alias
    const args = arguments // eslint-disable-line prefer-rest-params

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
): MutationObserver {
  // eslint-disable-next-line prefer-const
  let observer: MutationObserver

  if (observer) {
    console.log(`Already observe changes`)
    observer.disconnect()
  }

  observer = new MutationObserver(cb)

  observer.observe(nodeToObserve, options)

  return observer
}

export function waitForElm(selector: string): Promise<Element> {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector))
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
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

export function getMessage(messageName: string, substitutions?: unknown): string {
  return browser.i18n.getMessage(messageName, substitutions)
}

export async function setStorage<K extends keyof TSI.StorageMap>(key: K, payload: TSI.StorageMap[K]): Promise<void> {
  try {
    await browser.storage.local.set({ [key]: payload })
  } catch (e) {
    console.error(`Error set ${key} in storage`, e)
  }
}

export async function getStorage<K extends keyof TSI.StorageMap>(key: K): Promise<TSI.StorageMap[K]> {
  try {
    const { [key]: data } = await browser.storage.local.get(key)
    return data
  } catch (e) {
    console.error(`Error set ${key} in storage`, e)
  }
}
