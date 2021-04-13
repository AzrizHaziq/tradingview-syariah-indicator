import { browser } from 'webextension-polyfill-ts'

export async function setUpdateAt(): Promise<Record<string, string>> {
  try {
    const {
      MYX: { updatedAt },
    } = await browser.storage.local.get('MYX')

    return { MYX: updatedAt }
  } catch {
    throw new Error('Failed to get data from browser storage in popup')
  }
}
