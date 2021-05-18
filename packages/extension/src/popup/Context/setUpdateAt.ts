import { browser } from 'webextension-polyfill-ts'

export async function setUpdateAt(): Promise<TSI.Flag[]> {
  try {
    const { DETAILS } = await browser.storage.local.get('DETAILS')

    if (process.env.NODE_ENV !== 'production') {
      return DETAILS.map(i => ({
        ...i,
        updatedAt: `${Math.floor(Math.random() * 12)}/${Math.floor(Math.random() * 25)}/2021`,
      }))
    }

    return DETAILS
  } catch {
    throw new Error('Failed to get data from browser storage in popup')
  }
}
