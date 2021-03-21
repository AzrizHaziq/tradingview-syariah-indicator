import { GA } from '../helper'

const currentI18N = browser.i18n.getMessage('js_popup_current_i18n')
document.body.setAttribute('data-tsi-i18n', currentI18N)

// get all data-i18n and write to textContent
Array.from(document.querySelectorAll('[data-i18n]')).forEach(
  item => (item.textContent = browser.i18n.getMessage(item.dataset['i18n']))
)

const homepageEl = document.querySelector('.js-homepage')
homepageEl.addEventListener('click', () => popupGa('click', 'homepage'))

// from manifest.json write to dom
const { author, homepage_url: githubPage_url, version } = browser.runtime.getManifest()
document.querySelector('[data-tsi=devName]').textContent = author

// githubPage_url
const githubEl = document.querySelector('[data-tsi=githubPage_url]')
githubEl.setAttribute('href', githubPage_url)
githubEl.addEventListener('click', () => popupGa('click', 'github'))

// Telegram group
const tgEl = document.querySelector('[data-tsi=js_popup_tg_group]')
tgEl.setAttribute('title', browser.i18n.getMessage('js_popup_tg_group'))
tgEl.addEventListener('click', () => popupGa('click', 'tg'))

// Extension version
const versionEl = document.querySelector('[data-tsi=js_popup_version]')
versionEl.textContent = `(${version})`
versionEl.setAttribute('title', browser.i18n.getMessage('js_popup_version'))
versionEl.addEventListener('click', () => popupGa('click', 'version'))

// Shariah Current at title
const myxShariahAtEl = document.querySelector('[data-tsi=js_popup_myx_current_shariah_list_at]')
myxShariahAtEl.setAttribute('title', browser.i18n.getMessage('js_popup_myx_current_shariah_list_at'))
myxShariahAtEl.addEventListener('click', () => popupGa('click', 'shariahAt'))

// refresh-icon listener
document.querySelector('.tsi-refresh-icon').addEventListener('click', async function (e) {
  const { parentElement } = e.target
  parentElement.classList.add('is-refreshing')

  await browser.runtime.sendMessage({
    type: 'ga',
    subType: 'event',
    payload: {
      eventCategory: 'popup',
      eventAction: 'invalidate-cache',
    },
  })

  await browser.runtime.sendMessage({ type: 'invalidate-cache' }).then(() => {
    const x = setTimeout(() => {
      parentElement.classList.remove('is-refreshing')
      updateShariahDate()

      clearTimeout(x)
    }, 2000)
  })
})

updateShariahDate()
async function updateShariahDate() {
  // from storage write to dom
  const {
    MYX: { updatedAt },
  } = await browser.storage.local.get('MYX')

  document.querySelector('[data-tsi=my_updated_at]').textContent = tsi.isValidDate(updatedAt)
    ? new Date(updatedAt).toLocaleDateString()
    : '-'
}

function popupGa(eventAction, eventLabel) {
  ga('send', {
    hitType: 'event',
    eventCategory: 'popup',
    eventAction,
    eventLabel,
  })
}

;(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r
  ;(i[r] =
    i[r] ||
    function () {
      ;(i[r].q = i[r].q || []).push(arguments)
    }),
    (i[r].l = 1 * new Date())
  ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
  a.async = 1
  a.src = g
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', `https://www.google-analytics.com/analytics.js?id=${tsi.GA}`, 'ga')
ga('create', GA, 'auto')
ga('set', 'checkProtocolTask', function () {})
ga('send', 'pageview', 'popup')
