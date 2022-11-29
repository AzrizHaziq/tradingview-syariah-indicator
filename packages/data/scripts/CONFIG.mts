import { CliProgress } from './utils.mts'
import { MAIN_DEFAULT_EXPORT } from '@app/shared'

// 'market' is used in /screener > dom node in filter by country
export const CONFIG = {
  isDev: 0,
  mainOutput: 'stock-list.json',
  humanOutput: 'stock-list-human.json',
  progressBar: new CliProgress().getInstance(),
  whitelist: [
    //  this should be in human form
    // [exchange, code, fullname]
    // https://www.tradingview.com/symbols/NASDAQ-HLAL/
    ['NASDAQ', 'HLAL', 'WAHED FTSE USA SHARIAH ETF'],
    ['FTSEMYX', 'FBMSHA', 'FTSE BURSA MALAYSIA EMAS SHARIAH INDEX'],
    ['FTSEMYX', 'FBMHIJRAH', 'FTSE BURSA MALAYSIA HIJRAH SHARIAH INDEX'],
    ['FTSEMYX', 'F4GBM', 'FTSE BURSA MALAYSIA MIDS CAP SHARIAH INDEX'],
  ] as MAIN_DEFAULT_EXPORT['human'],
  MYX: {
    market: 'malaysia',
    home_page:
      'https://www.bursamalaysia.com/market_information/equities_prices?legend%5B%5D=%5BS%5D&per_page=50&page=1',
    exchanges: ['MYX'],
    shape: [{ 0: 'non-s', 1: 's', default: '' }],
  },
  CHINA: {
    market: 'china',
    // will be based on VP-DJ Shariah China A-Shares 100 ETF (0838EA)
    home_page:
      'https://www.bursamalaysia.com/market_information/equities_prices?keyword=VP-DJ+SHARIAH+CHINA+A-SHARES+100+ETF+-+MYR&top_stock=&board=&alphabetical=&sector=&legend%5B%5D=%5BS%5D&sub_sector=',
    home_page2: 'https://www.bursamalaysia.com/market_information/announcements/company_announcement?company=0838EA',
    exchanges: ['SSE', 'SZSE'],
    shape: [{ 0: 'non-s', 1: 's', default: '' }],
    blackListItems: ['CHINA100-MYR', 'MYL0838EA002'],
    remapExchangeFromGoogleToTV: {
      SHE: 'SZSE',
      SHA: 'SSE',
    },
  },
  US: {
    market: 'america',
    // will be based on HLAL ETF Wahed
    home_page: 'https://funds.wahedinvest.com/',
    blackListItems: ['Cash&Other'],
    exchanges: ['NYSE', 'NASDAQ', 'AMAX', 'OTC'],
    shape: [{ 0: 'non-s', 1: 's', default: '' }],
    wahedHoldingUrl: 'https://funds.wahedinvest.com/etf-holdings.csv',
  },
  IDX: {
    market: 'indonesia',
    // will be based on Indonesian exchange official website
    home_page: 'https://www.idx.co.id/en/market-data/stocks-data/stock-index',
    exchanges: ['IDX'],
    shape: [{ 0: 'non-s', 1: 's', default: '' }],
  },
}
