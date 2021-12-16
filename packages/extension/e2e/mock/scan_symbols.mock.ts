import { newsHeadlinesMock } from 'packages/extension/e2e/mock/news-headlines.mock'

export const scan_symbols_mock: any = [
  '**/america/scan',
  {
    totalCount: 1,
    data: [
      {
        s: 'NASDAQ:TSLA',
        d: [
          0, 48.92606513, 43.60786412, 26.60645118, 31.4099906, 29.00401461, 41.87107429, -47.95760965, -126.35568669,
          23.50813135, 25.56347342, 30.32521758, 22.65029739, 32.1473553, -19.92748853, 5.28329647, 35.96426706,
          -105.12, -128.05, 11.06058501, 29.11451384, 0, 8.70496147, 0, -59.73354544, 1, -65.67039196, 0, 50.79396414,
          1070.58480699, 1051.75, 1084.403, 1073.19331584, 1078.9925, 1053.81844745, 1101.219, 1001.69283354, 991.3784,
          901.67491509, 851.515, 787.47302279, 753.3011, 0, 1096.995, -1, 1074.17534137, 1, 1008.337,
        ],
      },
    ],
  },
]

// await page.route(scan_symbols_mock[0], (route) =>
//   route.fulfill({
//     status: 200,
//     contentType: 'application/json',
//     headers: {
//       'access-control-allow-origin': 'https://www.tradingview.com',
//       'access-control-allow-credentials': 'true',
//       'access-control-allow-headers': 'X-UserId,X-UserExchanges,X-CSRFToken',
//       'access-control-allow-methods:': 'GET, POST, OPTIONS',
//     },
//     body: JSON.stringify(scan_symbols_mock[1]),
//   })
// )
//
// await page.waitForResponse(scan_symbols_mock[0]),
