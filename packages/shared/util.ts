import { ExchangeDetail, RESPONSE_FROM_JSON, StorageMap } from './model'

export function required<T extends { length: number }>(s: T): T {
  if (s.length === 0) {
    throw { msg: 'required input ' }
  }

  return s
}

export function isFormatCorrect<T extends { length: number }>(s: T): T {
  if (Array.isArray(s)) {
    s.forEach(([stockCode, obj]) => {
      const split = stockCode.split(':')

      if (split.length !== 2) throw { msg: `${stockCode}: need to satisfy "market:stockCode"` }
      if (!Object.hasOwn(obj, 's')) throw { msg: `doesnt have "s" as a key. eg: [${stockCode}, {"s": 0}]` }
      if (!(obj.s === 1 || obj.s === 0)) throw { msg: `"s" valid value is either 0/1. eg: [${stockCode}, {"s": 0}]` }
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

export function debounce<T>(
  func: (...unknown: any[]) => void,
  wait: number,
  immediate: boolean
): (...args: T[]) => void {
  let timeout: number | undefined

  return (...args: T[]) => {
    // @ts-ignore
    const context = this // eslint-disable-line @typescript-eslint/no-this-alias
    // const args = arguments // eslint-disable-line prefer-rest-params

    const later = function () {
      timeout = undefined
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, (wait = 500))

    if (callNow) func.apply(context, args)
  }
}

export const transformStockListResponse = (response: RESPONSE_FROM_JSON): StorageMap['LIST'] => {
  // @ts-ignore
  return Object.entries(response).flatMap(([exchange, exchangeDetail]) => {
    const { shape, list } = exchangeDetail as ExchangeDetail
    return Object.entries(list).map(([symbol, symbolData]) => {
      const val = symbolData.reduce(
        // @ts-ignore
        (acc, value, index) => ({
          ...acc,
          [shape[index].hasOwnProperty(value) ? shape[index][value] : shape[index].default]: value,
        }),
        {} as Record<string, Record<string, number | boolean | string>>
      )

      return [`${exchange}:${symbol}`, val]
    })
  })
}
