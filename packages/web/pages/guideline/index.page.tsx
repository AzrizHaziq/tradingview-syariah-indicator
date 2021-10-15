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
      <h2 id='please-do-refer-to-original-website-before-buying.-and-if-youre-holding-then-look-at-them-everyday.'>
        Please do refer to original website before buying and if you're holding, then look at them everyday.
      </h2>
      <h3 id='malaysia'>Malaysia Stocks(MYX)</h3>
      <ol>
        <li>Malaysia had a very good website which list out all Shariah Compliant</li>
        <li>
          Every <b>Mei</b> and <b>November</b>, Shariah Board will update the list accordingly.
        </li>
        <li>
          For more info click here:
          <a href='https://www.bursamalaysia.com/market_information/equities_prices?legend%5B%5D=%5BS%5D&sort_by=short_name&sort_dir=asc&page=1'>
            MYX
          </a>
        </li>
      </ol>
      <h3 id='china100-a-stocks'>China100 A stocks(Shenzhen, Shanghai)</h3>
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
      <h3 id='wahed-etf-hlal'>Wahed ETF HLAL(Nasdaq, NYSE)</h3>
      <ol>
        <li>
          Read more here <a href='https://funds.wahedinvest.com/'>HLAL</a>
        </li>
      </ol>
    </div>
  )
}
