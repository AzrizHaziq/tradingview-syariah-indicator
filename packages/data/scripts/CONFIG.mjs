import { CliProgress } from './utils.mjs'

export const CONFIG = {
  mainOutput: 'stock-list.json',
  humanOutput: 'stock-list-human.json',
  progressBar: new CliProgress().getInstance(),
  US: {
    blackListItems: ['Cash&Other'],
    exchanges: ['NYSE', 'NASDAQ', 'AMAX', 'OTC'],
    wahedHoldingUrl: 'https://funds.wahedinvest.com/etf-holdings.csv',
    shape: [
      {
        '0': 'non-s',
        '1': 's',
        default: '',
      },
    ],
  },
}
