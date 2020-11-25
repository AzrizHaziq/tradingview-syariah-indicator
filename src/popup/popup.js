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
document.querySelector('[data-tsi=homepage_url]').setAttribute('href', homepage_url)

// Telegram group
document
  .querySelector('[data-tsi=js_popup_tg_group]')
  .setAttribute('title', browser.i18n.getMessage('js_popup_tg_group'))

// Extension version
document.querySelector('[data-tsi=js_popup_version]').textContent = `(${version})`

document.querySelector('[data-tsi=js_popup_version]').setAttribute('title', browser.i18n.getMessage('js_popup_version'))

// Shariah Current at title
document
  .querySelector('[data-tsi=js_popup_myx_current_shariah_list_at]')
  .setAttribute('title', browser.i18n.getMessage('js_popup_myx_current_shariah_list_at'))

// MSC current at title
document
  .querySelector('[data-tsi=js_msc_updated_at]')
  .setAttribute('title', browser.i18n.getMessage('js_msc_updated_at'))

// from storage write to dom
;(async () => {
  const {
    MYX: { mscAt, mscLink, updatedAt },
  } = await browser.storage.local.get('MYX')

  // MSC current at href
  document.querySelector('[data-tsi=js_msc_updated_at]').setAttribute('href', mscLink)

  document.querySelector('[data-tsi=my_updated_at]').textContent = tsi.isValidDate(updatedAt)
    ? new Date(updatedAt).toLocaleDateString()
    : '-'

  // MSC current at date
  document.querySelector('[data-tsi=my_msc_updated_at]').textContent = tsi.isValidDate(mscAt)
    ? new Date(mscAt).toLocaleDateString()
    : '-'
})()
