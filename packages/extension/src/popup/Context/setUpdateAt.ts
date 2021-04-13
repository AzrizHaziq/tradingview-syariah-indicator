import { initState } from './useCurrentDate'
import { browser } from 'webextension-polyfill-ts'

export async function setUpdateAt(): Promise<Record<string, Date>> {
  try {
    return initState.reduce(async (acc: any, flag) => {
      const {
        [flag.id]: { updatedAt },
      } = await browser.storage.local.get(flag.id)

      return {
        ...acc,
        [flag.id]:
          process.env.NODE_ENV === 'production'
            ? updatedAt
            : `${Math.floor(Math.random() * 12)}/${Math.floor(Math.random() * 25)}/2021`,
      }
    }, {})
  } catch {
    throw new Error('Failed to get data from browser storage in popup')
  }
}
