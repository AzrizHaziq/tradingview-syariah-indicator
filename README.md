# Tradingview Shariah Indicator 

## What it does
Add a small green indicator in tradingview.com. At the moment, only cover Malaysia, NYSE, Nasdaq, Shenzhen, Shanghai, Indonesia.

Source data:
MYX: [Bursa Malaysia](https://www.bursamalaysia.com/market_information/equities_prices?legend%5B%5D=%5BS%5D&sort_by=short_name&sort_dir=asc&page=1)
NASDAQ/NYSE: [Wahed ETF HLAL](https://funds.wahedinvest.com)
SSE/SZSE: [China100 A stocks](https://www.valuepartners-group.com.my/en/shariah-china/)

Inspired from: 
https://github.com/amree/tradingview-shariah-indicators


## Download
<a target="_blank" rel="noopener noreferrer"
   title="Download Tradingview Shariah indicator in Chrome now"
   href="https://chrome.google.com/webstore/detail/tradingview-shariah-indic/eogackkjbjbbmlkbakekhaanphmnpkgf?utm_source=github&utm_medium=website&utm_campaign=shariah-invest">
    <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_128x128.png" width="48" />
</a>
![Chrome Web Store](https://img.shields.io/chrome-web-store/v/eogackkjbjbbmlkbakekhaanphmnpkgf?color=blue&label=version)
![Chrome Web Store](https://img.shields.io/chrome-web-store/users/eogackkjbjbbmlkbakekhaanphmnpkgf?color=blue)



<a target="_blank" rel="noopener noreferrer"
   title="Download Tradingview Shariah indicator in Firefox now" 
   href="https://addons.mozilla.org/en-US/firefox/addon/tradingview-shariah-indicator?utm_source=github&utm_medium=website&utm_campaign=shariah-invest">
    <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_128x128.png" width="48" />
</a>
![Mozilla Add-on](https://img.shields.io/amo/v/tradingview-shariah-indicator?color=orange&label=version)
![Mozilla Add-on](https://img.shields.io/amo/users/tradingview-shariah-indicator?color=orange)
![Mozilla Add-on](https://img.shields.io/amo/rating/tradingview-shariah-indicator?color=orange)


Also available in: 
<a target="_blank" rel="noopener noreferrer"
   title="Download Tradingview Shariah indicator in Edge now" 
   href="https://support.microsoft.com/en-my/help/4027935/microsoft-edge-add-or-remove-browser-extensions">
    <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_128x128.png" width="24" />
</a>
<a target="_blank" rel="noopener noreferrer"
   title="Download Tradingview Shariah indicator in Brave now" 
   href="https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave-">
    <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/brave/brave_128x128.png" width="24" />
</a>


Installation guide:
1. Install with: 
    - [Chrome](https://chrome.google.com/webstore/detail/tradingview-shariah-indic/eogackkjbjbbmlkbakekhaanphmnpkgf)
    - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tradingview-shariah-indicator)
    - [Edge](https://support.microsoft.com/en-my/help/4027935/microsoft-edge-add-or-remove-browser-extensions) and [Brave](https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave-): Please follow this steps and then install this extension via chrome store.
2. Click button "Add to Chrome" / "Add to Firefox"
3. Open https://tradingview.com
4. Goto any of this page https://tradingview.com/chart https://tradingview.com/screener https://tradingview.com/symbols
5. Seach any [valid Shariah Stocks](https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/contents/MYX.txt) (currently in Malaysia only)


## Release 
[View All Releases](https://github.com/AzrizHaziq/tradingview-syariah-indicator/releases) 


## Screenshots
[Symbol Page](https://www.tradingview.com/symbols/MYX-TOPGLOV/)
![Symbol page](/assets/ori_chrome/symbol_page.png)

[Chart page](https://www.tradingview.com/chart/)
![Chart page](/assets/ori_chrome/chart_page.png)
![Chart page with screener](/assets/ori_chrome/chart_page_with_screener.png)

[Screener page](https://www.tradingview.com/screener/)
![Screener page](/assets/ori_chrome/screener_page_on.png)

Popup

![popup](/assets/ori_chrome/popup.jpg)


## Youtube video
[![tradingview-syariah-indicator](https://img.youtube.com/vi/4U8mu_5UfUQ/0.jpg)](https://www.youtube.com/watch?v=4U8mu_5UfUQ)

Feel free to contact me if any bug or more features here  
[azrizhaziq@gmail.com](mailto:azrizhaziq@gmail.com)


## Developers
Requirements
- node = look at `.nvmrc`
- pnpm = 6.24.1
- git = 2.23.0

1. Type in terminal `$ pnpm install`
2. Type in 1st terminal: `$ npm run watch`
   and then in another terminal type either below commands:
   Firefox: `$ npm run watch:ff` 
   Chrome: `$ npm watch:c`
   
   
## Generate Production ready extension
1. `$ git clone git@github.com:AzrizHaziq/tradingview-syariah-indicator.git`
2. `$ pnpm install`
3. create `.env.production` file in root, and please follow `.env.example`
4. Type in terminal `$ npm run build`
5. Generate a file located in /web-ext-artifacts/tradingview-shariah-indicator-{{ version }}.zip


## Update Stock list data (will take a few X minutes)
1. Type in terminal `$ npm run update-data`
    

## Todo
- [X] Add US stocks
- [X] Read pdf from ChinaA ETF
- [X] Add e2e test with playwright + github action run with schedule
- [X] Add website, host in vercel with SolidJS(SPA), waiting a meta framework from Solid.
- [ ] Add an option page where user can custom its own data.
- [X] Test chrome webStore-cli npm, and firefox addons
- [X] Create a page where a list of US, MY, China stocks and 
    - [X] search
    - [X] filter
    - [X] use json hosted in github raw
- [ ] Added a page for "accept agreement/conditions"
- [X] @Data, do some diffing with current data. If exists, then commit it.


### Please do refer to original website before buying. And if you're holding then look at them every day.
#### 1. China100 A stocks
1. Go to [Bursa Malaysia](https://www.bursamalaysia.com/bm/market_information/announcements/company_announcement/announcement_details?ann_id=3174424) 
2. Then click the pdf [Prospectus VP-DJ Shariah China A-Shares 100 ETF d.12 July 2021.pdf](https://disclosure.bursamalaysia.com/FileAccess/apbursaweb/download?id=209757&name=EA_DS_ATTACHMENTS)
3. Read at page 48 about Shariah


#### 2. For Wahed ETF HLAL
1. Read more here [HLAL](https://funds.wahedinvest.com/)


#### 3. Indonesia Exchange
1. More info here [IDX](https://idx.co.id/idx-syariah/indeks-saham-syariah)


#### 4. Shenzen & Shanghai Exchange
1. More info here [China ETF](https://www.valuepartners-group.com.my/en/shariah-china/)


![Alt](https://repobeats.axiom.co/api/embed/6b9d87cc3438de7959bbdf70582279fa2397012d.svg "Repobeats analytics image")
