import { format } from 'date-fns'

export type PageProps = {
  data: [exchange: string, code: string, name: string][]
  metadata: Record<string, Date>
  exchangesList: string[]
  queryParams: Partial<{
    q: string
    exchange: string | string[]
  }>
}

export const ShariahFetcher = async (): Promise<PageProps> => {
  const res = await fetch(import.meta.env.VITE_FETCH_URL as string)
  const { data, metadata } = await res.json()

  const m = Object.entries(metadata).reduce(
    (acc, [exchange, date]) => ({
      ...acc,
      [exchange]: format(new Date(date as Date), 'dd LLL yy'),
    }),
    {}
  )

  /**
   * output example
   * { exchange: ['MYX', 'NASDAQ', 'SSE'], q: "search key" }
   */
  const queryParams: Record<string, string[] | string> = location.href
    .replace(location.origin, '')
    .replace(/\/list(\?)?/g, '')
    .split('&')
    .reduce((acc, i) => {
      if (!i) {
        return acc
      }

      const [key, value] = i.split('=')
      return acc.hasOwnProperty(key)
        ? Array.isArray(acc[key])
          ? {
              ...acc,
              [key]: [...acc[key], value],
            }
          : {
              ...acc,
              [key]: [acc[key], value],
            }
        : {
            ...acc,
            [key]: value,
          }
    }, {})

  return {
    data,
    metadata: m,
    queryParams,
    exchangesList: Array.isArray(queryParams.exchange)
      ? queryParams.exchange
      : typeof queryParams.exchange === 'string'
      ? [queryParams.exchange]
      : Object.keys(metadata),
  }
}
