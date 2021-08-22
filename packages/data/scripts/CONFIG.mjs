import cliProgress from 'cli-progress'

export const CONFIG = {
  mainOutput: 'stock-list.json',
  progressBar: null,
  progressBarType: cliProgress.Presets.legacy,
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
