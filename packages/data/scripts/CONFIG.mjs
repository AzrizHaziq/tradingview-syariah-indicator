import cliProgress from 'cli-progress'

export const CONFIG = {
  mainOutput: 'stock-list.json',
  humanOutput: 'stock-list-human.json',
  progressBar: new cliProgress.MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
    },
    cliProgress.Presets.shades_grey
  ),
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
