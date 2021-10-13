import { Component } from 'solid-js'
import chrome_popup from '../../../../docs/ori_chrome/popup.png'
import chrome_chart from '../../../../docs/ori_chrome/chart_page.png'
import chrome_symbol from '../../../../docs/ori_chrome/symbol_page.png'
import chrome_screener from '../../../../docs/ori_chrome/screener_page_on.png'
import chrome_chartWithScreener from '../../../../docs/ori_chrome/chart_page_with_screener.png'

export const Page: Component = () => {
  return (
    <div class='prose'>
      <h1 id='tradingview-syariah-indicator'>Tradingview Syariah Indicator</h1>
      <h2 id='what-it-does'>What it does</h2>
      <p>
        Add a small green indicator in tradingview.com, unfortunately currently only cover Malaysian, NYSE, Nasdaq,
        Shenzhen, Shanghai at the moment.
      </p>
      <p>
        Source data:
        <a href='https://www.bursamalaysia.com/market_information/equities_prices?legend%5B%5D=%5BS%5D&amp;sort_by=short_name&amp;sort_dir=asc&amp;page=1'>
          Bursa Malaysia
        </a>
      </p>
      <p>
        Inspired from:
        <a href='https://github.com/amree/tradingview-shariah-indicators'>
          https://github.com/amree/tradingview-shariah-indicators
        </a>
      </p>
      <h2 id='download'>Download</h2>
      <div className='flex flex-col gap-y-2'>
        <div className='flex gap-2 items-center'>
          <a
            target='_blank'
            rel='noopener noreferrer'
            title='Download Tradingview Shariah indicator in Chrome now'
            href='https://chrome.google.com/webstore/detail/tradingview-shariah-indic/eogackkjbjbbmlkbakekhaanphmnpkgf?utm_source=github&utm_medium=website&utm_campaign=shariah-invest'>
            <img
              class='!my-0'
              src='https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_128x128.png'
              width='32'
            />
          </a>
          <img
            class='!my-0'
            src='https://img.shields.io/chrome-web-store/v/eogackkjbjbbmlkbakekhaanphmnpkgf?color=blue&amp;label=version'
            alt='Chrome Web Store'
          />
          <img
            class='!my-0'
            src='https://img.shields.io/chrome-web-store/users/eogackkjbjbbmlkbakekhaanphmnpkgf?color=blue'
            alt='Chrome Web Store'
          />
        </div>
        <div class='flex gap-2 items-center'>
          <a
            target='_blank'
            rel='noopener noreferrer'
            title='Download Tradingview Shariah indicator in Firefox now'
            href='https://addons.mozilla.org/en-US/firefox/addon/tradingview-shariah-indicator?utm_source=github&utm_medium=website&utm_campaign=shariah-invest'>
            <img
              class='!my-0'
              src='https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_128x128.png'
              width='32'
            />
          </a>
          <img
            class='!my-0'
            src='https://img.shields.io/amo/v/tradingview-shariah-indicator?color=orange&amp;label=version'
            alt='Mozilla Add-on'
          />
          <img
            class='!my-0'
            src='https://img.shields.io/amo/users/tradingview-shariah-indicator?color=orange'
            alt='Mozilla Add-on'
          />
          <img
            class='!my-0'
            src='https://img.shields.io/amo/rating/tradingview-shariah-indicator?color=orange'
            alt='Mozilla Add-on'
          />
        </div>
      </div>
      <div class='flex gap-2 mt-2'>
        Also available in:
        <a
          target='_blank'
          rel='noopener noreferrer'
          title='Download Tradingview Shariah indicator in Edge now'
          href='https://support.microsoft.com/en-my/help/4027935/microsoft-edge-add-or-remove-browser-extensions'>
          <img
            class='!my-0'
            src='https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_128x128.png'
            width='24'
          />
        </a>
        <a
          target='_blank'
          rel='noopener noreferrer'
          title='Download Tradingview Shariah indicator in Brave now'
          href='https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave-'>
          <img
            class='!my-0'
            src='https://raw.githubusercontent.com/alrra/browser-logos/master/src/brave/brave_128x128.png'
            width='24'
          />
        </a>
      </div>
      <p>Installation guide:</p>
      <ol>
        <li>
          <p>Install with:</p>
          <ul>
            <li>
              <a href='https://chrome.google.com/webstore/detail/tradingview-shariah-indic/eogackkjbjbbmlkbakekhaanphmnpkgf'>
                Chrome
              </a>
            </li>
            <li>
              <a href='https://addons.mozilla.org/en-US/firefox/addon/tradingview-shariah-indicator'>Firefox</a>
            </li>
            <li>
              <a href='https://support.microsoft.com/en-my/help/4027935/microsoft-edge-add-or-remove-browser-extensions'>
                Edge
              </a>
              and
              <a href='https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave-'>
                Brave
              </a>
              : Please follow this steps and then install this extension via chrome store.
            </li>
          </ul>
        </li>
        <li>Click button &quot;Add to Chrome&quot; / &quot;Add to Firefox&quot;</li>
        <li>
          Open <a href='https://tradingview.com'>https://tradingview.com</a>
        </li>
        <li>
          Goto any of this page
          <a href='https://tradingview.com/chart'>https://tradingview.com/chart</a>
          <a href='https://tradingview.com/screener'>https://tradingview.com/screener</a>
          <a href='https://tradingview.com/symbols'>https://tradingview.com/symbols</a>
        </li>
        <li>
          <p>
            Search any
            <a href='https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/contents/MYX.txt'>
              valid Shariah Stocks
            </a>
            (currently in Malaysia only)
          </p>
        </li>
      </ol>
      {/**/}
      <h2 id='release'>Release</h2>
      <a href='https://github.com/AzrizHaziq/tradingview-syariah-indicator/releases'>View All Releases</a>
      {/**/}
      <h2 id='screenshots'>Screenshots</h2>
      <a href='https://www.tradingview.com/symbols/MYX-TOPGLOV/'>Symbol Page</a>
      <img src={chrome_symbol} alt='Symbol page' />

      <a href='https://www.tradingview.com/chart/'>Chart page</a>
      <img src={chrome_chart} alt='Chart page' />
      <img src={chrome_chartWithScreener} alt='Chart page with screener' />

      <a href='https://www.tradingview.com/screener/'>Screener page</a>
      <img src={chrome_screener} alt='Screener page' />
      <p>Popup</p>
      <img src={chrome_popup} alt='popup' />
      {/**/}
      <h2 id='youtube-video'>Youtube video</h2>
      <a href='https://www.youtube.com/watch?v=4U8mu_5UfUQ'>
        <img src='https://img.youtube.com/vi/4U8mu_5UfUQ/0.jpg' alt='tradingview-syariah-indicator' />
      </a>
      <p>Feel free to contact me if any bugs raises.</p>
      <h3 id='please-do-refer-to-original-website-before-buying.-and-if-youre-holding-then-look-at-them-everyday.'>
        Please do refer to original website before buying and if you're holding, then look at them everyday.
      </h3>
      <h4 id='china100-a-stocks'>1. China100 A stocks</h4>
      <ol>
        <li>
          Go to
          <a href='https://www.bursamalaysia.com/bm/market_information/announcements/company_announcement/announcement_details?ann_id=3174424'>
            Bursa Malaysia
          </a>
        </li>
        <li>
          Then click the pdf
          <a href='https://disclosure.bursamalaysia.com/FileAccess/apbursaweb/download?id=209757&amp;name=EA_DS_ATTACHMENTS'>
            Prospectus VP-DJ Shariah China A-Shares 100 ETF d.12 July 2021.pdf
          </a>
        </li>
        <li>Read at page 48 about Shariah</li>
      </ol>
      <h4 id='for-wahed-etf-hlal'>2. For Wahed ETF HLAL</h4>
      <ol>
        <li>
          Read more here <a href='https://funds.wahedinvest.com/'>HLAL</a>
        </li>
      </ol>
    </div>
  )
}
