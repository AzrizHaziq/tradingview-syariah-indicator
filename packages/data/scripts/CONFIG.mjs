import { CliProgress } from './utils.mjs'

export const CONFIG = {
  isDev: 0,
  mainOutput: 'stock-list.json',
  humanOutput: 'stock-list-human.json',
  progressBar: new CliProgress().getInstance(),
  MYX: {
    shape: [{ 0: 'non-s', 1: 's', default: '' }],
  },
  CHINA: {
    // will be based on VP-DJ Shariah China A-Shares 100 ETF (0838EA)
    home_page: 'https://www.valuepartners-group.com.my/en/shariah-china/',
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
    // will be based on HLAL ETF Wahed
    home_page: 'https://funds.wahedinvest.com/',
    blackListItems: ['Cash&Other'],
    exchanges: ['NYSE', 'NASDAQ', 'AMAX', 'OTC'],
    shape: [{ 0: 'non-s', 1: 's', default: '' }],
    wahedHoldingUrl: 'https://funds.wahedinvest.com/etf-holdings.csv',
  },
}
