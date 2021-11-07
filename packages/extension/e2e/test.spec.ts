import { t } from './_default'

const delay = (n) => new Promise((res) => setTimeout(res, n))

t('test', async ({ page }) => {
  await delay(10_000_000)
  // expect(1 + 2).toEqual(3)
  // You are signed in!
})
