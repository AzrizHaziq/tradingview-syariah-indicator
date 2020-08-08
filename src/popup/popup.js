/* global tsi */

// get all data-i18n and write to textContent
Array.from(document.querySelectorAll('[data-i18n]')).forEach(item =>
  item.textContent = browser.i18n.getMessage(item.dataset['i18n'])
)

// from manifest.json write to dom
const { author, homepage_url, version, } = browser.runtime.getManifest()

document.querySelector('[data-tsi=devName]').textContent = author
document.querySelector('[data-tsi=version]').textContent = `(${ version })`
document.querySelector('[data-tsi=homepage_url]').setAttribute('href', homepage_url)
document.querySelector('[data-tsi=tg_me]').setAttribute('title', browser.i18n.getMessage('js_popup_tg_me'))
document.querySelector('[data-tsi=version]').setAttribute('title', browser.i18n.getMessage('js_popup_version'))
document.querySelector('[data-tsi=my_current_shariah_list]').setAttribute('title', browser.i18n.getMessage('js_popup_current_shariah_list'))

// from storage write to dom
;(async() => {
  const { MSC_AT } = (await browser.storage.local.get('MSC_AT'))
  const { UPDATED_AT } = (await browser.storage.local.get('UPDATED_AT'))

  document.querySelector('[data-tsi=my_updated_at]').textContent = tsi.isValidDate(UPDATED_AT)
    ? new Date(UPDATED_AT).toLocaleDateString()
    : '-'

  document.querySelector('[data-tsi=my_msc_updated_at]').textContent = tsi.isValidDate(MSC_AT)
    ? new Date(MSC_AT).toLocaleDateString()
    : '-'
})()
