// get all data-i18n and write to textContent
Array.from(document.querySelectorAll('[data-i18n]')).forEach(item => {
  const i18n = browser.i18n.getMessage(item.dataset['i18n'])
  console.log(i18n, item.dataset)
  item.textContent = i18n
})

// from manifest.json write to dom
const { developer: { name: devName }, homepage_url, version, } = browser.runtime.getManifest()

document.querySelector('[data-tsi=devName]').textContent = devName
document.querySelector('[data-tsi=version]').textContent = `(${ version })`
document.querySelector('[data-tsi=version]').setAttribute('title', 'current version')
document.querySelector('[data-tsi=homepage_url]').setAttribute('href', homepage_url);

// from storage write to dom
(async () => {
  const { UPDATED_AT } = (await browser.storage.local.get('UPDATED_AT'))

  document.querySelector('[data-tsi=my_updated_at]').textContent = new Date(UPDATED_AT).toLocaleDateString()
})()
