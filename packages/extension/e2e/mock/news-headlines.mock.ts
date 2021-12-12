import { Page } from '@playwright/test'

const newsHeadlinesMock: any = [
  {
    id: 'urn:newsml:mtnewswires.com:20200922:G1946957:0',
    title: 'asdadasdasd IDG Capital Eyes To Raise $550 Million for New Fund',
    published: 1600829100,
    source: 'MT Newswires',
    permission: 'headline',
    relatedSymbols: [{ symbol: 'HKEX:1810', logoid: 'xiaomi' }, { symbol: 'SSE:601360' }],
    astDescription: {
      type: 'root',
      children: [
        {
          type: 'p',
          children: [
            'IDG Capital plans to raise as much as $550.0 million for a new venture capital fund, according to a US filing from the China-focused venture capitalist. ',
          ],
        },
        {
          type: 'p',
          children: [
            "The fundraising for IDG Capital Project Fund IV comes as the investment company's fundraising for another fund, IDG China Venture Capital Fund VI, is ongoing, with a target of $688.0 million. ",
          ],
        },
        {
          type: 'p',
          children: [
            'IDG Capital entered China in 1993 and many of its portfolio companies have gone public, including Tencent (HKG:0700), Baidu (',
            { type: 'symbol', params: { symbol: 'NASDAQ:BIDU', text: 'NASDAQ:BIDU' } },
            '), Xiaomi (',
            { type: 'symbol', params: { symbol: 'HKEX:1810', text: 'HKEX:1810' } },
            ') and Qihoo 360 (',
            { type: 'symbol', params: { symbol: 'SSE:601360', text: 'SSE:601360' } },
            '), according to a Caixin Global report. ',
          ],
        },
        { type: 'p', children: ['Price (HKD): $17.55, Change: $-0.05, Percent Change: -0.28%'] },
      ],
    },
  },
  {
    id: 'urn:newsml:mtnewswires.com:20200526:G1918488:0',
    title: 'Market Chatter: Investors, Analysts Weigh Impact on Chinese Companies of US Entity List Inclusion',
    published: 1590465720,
    source: 'MT Newswires',
    permission: 'headline',
    relatedSymbols: [{ symbol: 'SSE:600498' }, { symbol: 'SSE:601360' }, { symbol: 'SZSE:300367' }],
    astDescription: {
      type: 'root',
      children: [
        {
          type: 'p',
          children: [
            'Analysts, companies and investors have weighed the possible effects on Chinese companies that were recently added by the US Commerce Department into the so-called Entity List that bars their access to American-made products without a US license, Caixin Global reported Tuesday. ',
          ],
        },
        {
          type: 'p',
          children: [
            "Two of the companies sanctioned were FiberHome Technologies and subsidiary Nanjing Fiberhome Starrysky Communication Development. FiberHome's listed unit Fiberhome Telecommunication (",
            { type: 'symbol', params: { symbol: 'SSE:600498', text: 'SSE:600498' } },
            ") slumped 9.9% following the news of the ban, indicating investors' reaction to the move. ",
          ],
        },
        {
          type: 'p',
          children: [
            "According to Everbright Securities, the sanction likely targets Nanjing Fiberhome Starrysky, which could disrupt its purchases of servers and circuit boards. However, FiberHome's core business could be severely hit if its acquisitions of optoelectronic chips and other components would be affected. ",
          ],
        },
        {
          type: 'p',
          children: [
            'Video recorded manufacturer NetPosa Technologies (',
            { type: 'symbol', params: { symbol: 'SZSE:300367', text: 'SZSE:300367' } },
            '), meanwhile, continues to skyrocket as stock gains continued to Tuesday with a 10% jump, shrugging off concerns over the sanction. The company said it will continue to source parts locally. ',
          ],
        },
        {
          type: 'p',
          children: [
            'Qihoo 360 (',
            { type: 'symbol', params: { symbol: 'SSE:601360', text: 'SSE:601360' } },
            '), on the other hand, said the ban would likely cause some disruptions but would not have a material impact on its operations. ',
          ],
        },
        {
          type: 'p',
          children: [
            'However, IPO plans of startups Intellifusion and CloudWalk could have hit a wall because of the Entity Listing. ',
          ],
        },
        {
          type: 'p',
          children: [
            'Analysts said the sanctions could have marginal impacts on some companies as they have diversified supply chains following the sanctions on Huawei Technologies and other peers. ',
          ],
        },
        {
          type: 'p',
          children: ['Shares of Fiberhome Telecommunication gained 1% midday, while stocks of Qihoo rose 2%. '],
        },
        {
          type: 'p',
          children: [
            '(Market Chatter news is derived from conversations with market professionals globally. This information is believed to be from reliable sources but may include rumor and speculation. Accuracy is not guaranteed.)',
          ],
        },
        { type: 'p', children: ['Price (RMB): ¥3.62, Change: ¥0.33, Percent Change: +10.03%'] },
      ],
    },
  },
  {
    id: 'urn:newsml:mtnewswires.com:20200525:G1918325:0',
    title: 'US Sanctions 33 Chinese Companies, Institutions Over Human Rights, Military Procurement',
    published: 1590387360,
    source: 'MT Newswires',
    permission: 'headline',
    relatedSymbols: [{ symbol: 'SSE:601360' }],
    astDescription: {
      type: 'root',
      children: [
        {
          type: 'p',
          children: [
            'The US Commerce Department has sanctioned 33 Chinese companies and institutions, adding them into the so-called US Entity List over allegations of human rights violations and supporting purchases of products used in Chinese military. ',
          ],
        },
        {
          type: 'p',
          children: [
            'Among the 24 companies included in the sanctions list for their alleged roles in the procurement of items for Chinese military use were Qihoo 360 Technology (',
            { type: 'symbol', params: { symbol: 'SSE:601360', text: 'SSE:601360' } },
            ') and a subsidiary, Cloudminds, High Pressure Science and Technology Advanced Research, the Harbin Engineering University, Harbin Institute of Technology, and the Peace Institute of Multiscale Science. ',
          ],
        },
        {
          type: 'p',
          children: [
            "The Commerce Department said the 24 companies and institutions engaged in activities detrimental to the US' foreign policy interests and national security. ",
          ],
        },
        {
          type: 'p',
          children: [
            "Meanwhile, the nine companies and institutions that were sanctioned for alleged violations of human rights in China's Xinjiang Uighur Autonomous Region were the Ministry of Public Security’s Institute of Forensic Science, Aksu Huafu Textiles, CloudWalk Technology, FiberHome Technologies Group and subsidiary Nanjing FiberHome Starrysky Communication Development, NetPosa and unit SenseNets, Intellifusion and IS’Vision. ",
          ],
        },
        {
          type: 'p',
          children: [
            'The companies and institutions will be barred from getting access to US commodities and technologies. ',
          ],
        },
        { type: 'p', children: ['Shares of Qihoo gained over 2% Monday afternoon. '] },
        { type: 'p', children: ['Price (RMB): ¥17.79, Change: ¥0.18, Percent Change: +1.02%'] },
      ],
    },
  },
  {
    id: 'urn:newsml:mtnewswires.com:20200226:G1902230:0',
    title: 'Shanghai Stock Exchange Movers: Tianjin Songjiang Gains 10%, 360 Security Technology Slides 10%',
    published: 1582775520,
    source: 'MT Newswires',
    permission: 'headline',
    relatedSymbols: [
      { symbol: 'SSE:600210' },
      { symbol: 'SSE:600225' },
      { symbol: 'SSE:600237' },
      { symbol: 'SSE:600268' },
      { symbol: 'SSE:600513' },
      { symbol: 'SSE:600653' },
      { symbol: 'SSE:600724' },
      { symbol: 'SSE:601360' },
      { symbol: 'SSE:603005' },
      { symbol: 'SSE:603023' },
    ],
    astDescription: {
      type: 'root',
      children: [
        { type: 'p', children: ['Shanghai Stock Exchange Top Movers as of 11:30 am GMT +8'] },
        ' ',
        { type: 'p', children: ['Gainers'] },
        ' ',
        { type: 'p', children: ['Tianjin Songjiang Co. Ltd. A, +10.2%'] },
        ' ',
        { type: 'p', children: ['Shanghai Shenhua Holdings Co. Ltd. A, +10.2%'] },
        ' ',
        { type: 'p', children: ['Anhui Tongfeng Electronics Co. Ltd. A, +10.1%'] },
        ' ',
        { type: 'p', children: ['Guodian Nanjing Automation Co. Ltd. A, +10.1%'] },
        ' ',
        { type: 'p', children: ['Ningbo Fuda Co. Ltd. A, +10.1%'] },
        ' ',
        { type: 'p', children: ['Losers '] },
        ' ',
        { type: 'p', children: ['360 Security Technology Inc. A, -10.0%'] },
        ' ',
        { type: 'p', children: ['Harbin Viti Electronics Corp. A, -10.0%'] },
        ' ',
        { type: 'p', children: ['Jiangsu Lianhuan Pharmaceutical Co. Ltd., -10.0%'] },
        ' ',
        { type: 'p', children: ['China Wafer Level CSP Co. Ltd., -9.1%'] },
        ' ',
        { type: 'p', children: ['Shanghai Zijiang Enterprise Group Co. Ltd. A, -8.7%'] },
        { type: 'p', children: ['Price (RMB): ¥2.70, Change: ¥0.25, Percent Change: +10.20%'] },
      ],
    },
  },
]

export const mockHeadlinesNews = async (page: Page) => {
  const news = (url) => url.startsWith('https://news-headlines.tradingview.com')
  await page.route(
    (url) => news(url.href),
    (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'access-control-allow-origin': 'https://www.tradingview.com',
          'access-control-allow-credentials': 'true',
          'access-control-allow-methods:': 'GET, OPTIONS',
          'cache-control': 'max-age=30',
          'content-encoding': 'gzip',
          date: 'Sun, 12 Dec 2021 14:37:19 GMT',
          expires: 'Sun, 12 Dec 2021 14:37:49 GMT',
          server: 'tv',
          vary: 'Origin',
          via: '209.58.134.249:443',
        },
        body: JSON.stringify(newsHeadlinesMock),
      })
    }
  )
}

// await page.waitForResponse((url) => {
//   console.log(url.request().url(), news(url.request().url()))
//   return news(url.request().url())
// })
