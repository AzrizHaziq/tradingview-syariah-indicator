import { JSX } from 'solid-js'
import { useTrackOnLoad } from '~/util'
import { Head, Title } from 'solid-start'
import { MetaSeo } from '~/components'

const props = {
  pageTittle: 'TSI: Guideline',
  description: 'Guide how to use TSI and few notes',
  path: 'guideline',
}

export default function Guideline(): JSX.Element {
  useTrackOnLoad()

  return (
    <>
      <Head>
        <Title></Title>
        <MetaSeo {...props} />
      </Head>

      <div class='mx-auto prose'>
        <p>
          This will be totally <b>free</b>. Reason being is that, I wanted to help those who want to trade individual
          stocks, rather than buying a basket of stocks(ETF/Unit trust). Hence, I hope that muslim will now be able to
          trade confidently under Shariah Law.
        </p>
        <p>
          AFAIK, I do find that most of the guideline have a little different one to another but these posts should help
          you understand what are the criteria:
        </p>
        <ul id='shariah-screening'>
          <li>
            <a href='https://www.muslimink.com/finance/how-to-check-if-a-stock-is-halal/'>muslimink</a>
          </li>
          <li>
            <a href='https://muslimxchange.com/shariah-screening-methodology/'>muslimexchange</a>
          </li>
          <li>
            <a href='https://www.sc.com.my/development/icm/shariah-compliant-securities/list-of-shariah-compliant-securities'>
              Security Commission(Malaysia) read the latest .pdf
            </a>
          </li>
        </ul>
        <p>
          Lastly, when opening an account with Broker, in my humble opinion just open a<b> Cash upfront account</b>. It
          means, you only invest the money that you have in your account and avoid using other people money. Only do it
          if you are aware of the risks and etc.
        </p>

        <div class='p-2 text-green-700 bg-green-50 rounded border-green-600 border-dashed border-3'>
          <h3 class='!m-0 !text-green-800'>Notes</h3>
          <ul class='!m-0'>
            <li>
              Before buying you should spend your time learning and understanding <b>Zakat</b> types and its
              calculation. Avoiding Zakat will not smoothen your afterlife journey.
            </li>
            <li>
              Also do take you time to understand the shariah{' '}
              <a href='#shariah-screening' class='!text-green-700'>
                here
              </a>
              .
            </li>
            <li>Please do refer to original website before buying.</li>
            <li>If you're holding, then look at the source everyday.</li>
            <li>
              Things can go south like the <b>data is not up to date</b>. As currently I'm manually updating the data on
              every Malaysia weekend.
            </li>
            <li>
              If you can't find the stock that you are looking for, it's not necessarily mean it's not <b>Shariah</b>.
              <ul>
                <li>
                  AFAIK currently, VP-DJ Shariah capped up to 100 stocks. Thus, you can perform you own quantitative and
                  qualitative assessment
                </li>
                <li>Wahed, its depend on their assessment.</li>
                <li>
                  For Malaysia, we had a very strict regulated Shariah board that do all the assessment and if you don't
                  find the stock, it means it's not shariah-compliance.
                </li>
              </ul>
            </li>
            <li>Let me know if there is any incorrect or insufficient statement or broken links in this website 🙂.</li>
          </ul>
        </div>
        <p>
          Below are the guides for checking the source of <b>Tradingview Shariah indicator</b>
        </p>

        {/* KLCI */}
        <h3 id='malaysia'>
          Malaysia Stocks(MYX)
          <a class='!ml-2' href='#malaysia'>
            #
          </a>
        </h3>
        <ol>
          <li>Malaysia had a very good website which list out all Shariah Compliant.</li>
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

        {/* VPDJ */}
        <h3 id='china100-a-stocks'>
          China100 A stocks(Shenzhen, Shanghai) by VP-DJ Shariah
          <a class='!ml-2' href='#china100-a-stocks'>
            #
          </a>
        </h3>
        <p>
          Latest Shariah List
          <a href='https://www.bursamalaysia.com/market_information/announcements/company_announcement?cat=&sub_type=&company=0838EA&alph=&dt_ht=&sec=&subsec=&dt_lt='>
            here
          </a>
          .
        </p>

        <p>Shariah Guideline:</p>
        <ol>
          <li>
            Go to
            <a href='https://www.bursamalaysia.com/market_information/announcements/company_announcement/announcement_details?ann_id=3174424'>
              Bursa Malaysia
            </a>
          </li>
          <li>
            Then click the pdf <br />
            <a href='https://disclosure.bursamalaysia.com/FileAccess/apbursaweb/download?id=209757&amp;name=EA_DS_ATTACHMENTS'>
              Prospectus VP-DJ Shariah China A-Shares 100 ETF d.12 July 2021.pdf
            </a>
          </li>
          <li>Read at page 48 about Shariah</li>
        </ol>

        {/* WAHED */}
        <h3 id='wahed-etf-hlal'>
          Wahed ETF HLAL(Nasdaq, NYSE)
          <a class='!ml-2' href='#wahed-etf-hlal'>
            #
          </a>{' '}
        </h3>
        <ol>
          <li>
            Read more here <a href='https://funds.wahedinvest.com/'>HLAL</a>
          </li>
          <li>
            Down below you can see the <a href='https://funds.wahedinvest.com/etf-holdings.csv'>holding</a> for latest
            Shariah List
          </li>
          <li>
            Wahed have a guide on purification, please do have a look at their website
            <a href='https://funds.wahedinvest.com/quarterly-purification-on-hlal-dividends.csv'>here</a>. Hence, if you
            are buying the stocks via Wahed ETF, then you need to purify it.
          </li>
        </ol>
      </div>
    </>
  )
}
