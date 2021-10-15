import { Component } from 'solid-js'
import logo from '../../../../assets/shariah-icon.svg'
import chrome_popup from '../../../../assets/ori_chrome/popup.png'
import chrome_chart from '../../../../assets/ori_chrome/chart_page.png'
import chrome_symbol from '../../../../assets/ori_chrome/symbol_page.png'
import chrome_screener from '../../../../assets/ori_chrome/screener_page_on.png'
import chrome_chartWithScreener from '../../../../assets/ori_chrome/chart_page_with_screener.png'

export const Page: Component = () => {
  return (
    <div class='prose'>
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
