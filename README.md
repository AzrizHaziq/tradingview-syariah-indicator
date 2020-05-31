# Tradingview Syariah Indicator

## What it does
Add a small indicator in tradingview.com, unfortunately currently only cover Malaysian stocks.

source data:
[bursa malaysia](https://www.bursamalaysia.com/market_information/equities_prices?legend%5B%5D=%5BS%5D&sort_by=short_name&sort_dir=asc&page=1)

inspired from
https://github.com/amree/tradingview-shariah-indicators


## Release 
As we all know that the CONVID-19 is no where near ending, there is a small delay from Google side to approve this extension( I also have some other difficulty with them for approval) But anyhow, you can download in release 

[https://github.com/AzrizHaziq/tradingview-syariah-indicator/releases](https://github.com/AzrizHaziq/tradingview-syariah-indicator/releases) 

and be sure to check the release note!


## Chrome Extension:
https://chrome.google.com/webstore/detail/tradingview-syariah-indic/eogackkjbjbbmlkbakekhaanphmnpkgf/related


## Firefox Extension
https://addons.mozilla.org/en-US/firefox/addon/tradingview-shariah-indicator/


## Symbol Page
![Symbol page](https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/docs/doc_symbol.png?raw=true)

## Chart page
![Chart page](https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/docs/doc_chart.png?raw=true)

## Screener page
![Screener page](https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/docs/doc_screener.png?raw=true)

## Youtube video
[![tradingview-syariah-indicator](https://img.youtube.com/vi/4U8mu_5UfUQ/0.jpg)](https://www.youtube.com/watch?v=4U8mu_5UfUQ)

Feel free to contact me if any bug or more features here  
[azrizhaziq@gmail.com](mailto:azrizhaziq@gmail.com)


## Developers
1. Need to have node and npm (please look at package.json > engine)
2. Type in terminal `$ npm install`
3. Type in terminal 
    Firefox: `$ npm run start` 
    Chrome: `$ npm run start:chrome`
   
   
## Generate Production ready extension
1. Type in terminal `$ npm run build`


## Update Stock list data (will take a few X minutes)
1. Type in terminal `$ npm run scrapping`
    
