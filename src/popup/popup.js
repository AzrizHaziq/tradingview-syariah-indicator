/* global tsi */

// Set current lang
const currentI18N = browser.i18n.getMessage('js_popup_current_i18n')
document.body.setAttribute('data-tsi-i18n', currentI18N)

// get all data-i18n and write to textContent
Array.from(document.querySelectorAll('[data-i18n]')).forEach(
  item => (item.textContent = browser.i18n.getMessage(item.dataset['i18n']))
)

// from manifest.json write to dom
const { author, homepage_url, version } = browser.runtime.getManifest()

document.querySelector('[data-tsi=devName]').textContent = author

// homepage_url
document
  .querySelector('[data-tsi=homepage_url]')
  .setAttribute('href', homepage_url)

// Telegram group
document
  .querySelector('[data-tsi=js_popup_tg_group]')
  .setAttribute('title', browser.i18n.getMessage('js_popup_tg_group'))

// Extension version
document.querySelector(
  '[data-tsi=js_popup_version]'
).textContent = `(${version})`

document
  .querySelector('[data-tsi=js_popup_version]')
  .setAttribute('title', browser.i18n.getMessage('js_popup_version'))

// Shariah Current at title
document
  .querySelector('[data-tsi=js_popup_myx_current_shariah_list_at]')
  .setAttribute(
    'title',
    browser.i18n.getMessage('js_popup_myx_current_shariah_list_at')
  )

// MSC current at title
document
  .querySelector('[data-tsi=js_msc_updated_at]')
  .setAttribute('title', browser.i18n.getMessage('js_msc_updated_at'))

// from storage write to dom
;(async () => {
  const { MSC_AT } = await browser.storage.local.get('MSC_AT')
  const { MSC_LINK } = await browser.storage.local.get('MSC_LINK')
  const { UPDATED_AT } = await browser.storage.local.get('UPDATED_AT')

  // MSC current at href
  document
    .querySelector('[data-tsi=js_msc_updated_at]')
    .setAttribute('href', MSC_LINK)

  document.querySelector(
    '[data-tsi=my_updated_at]'
  ).textContent = tsi.isValidDate(UPDATED_AT)
    ? new Date(UPDATED_AT).toLocaleDateString()
    : '-'

  // MSC current at date
  document.querySelector(
    '[data-tsi=my_msc_updated_at]'
  ).textContent = tsi.isValidDate(MSC_AT)
    ? new Date(MSC_AT).toLocaleDateString()
    : '-'
})()
