import { JSX } from "solid-js";
import { IMGS, useTrackOnLoad } from "@util";

export default function Home(): JSX.Element {
  useTrackOnLoad();

  return (
    <>
      <div class="mx-auto prose">
        <h1>Tradingview Shariah Indicator</h1>
        <h2 id="what-it-does">
          What it does
          <a class="!ml-2" href="#what-it-does">
            #
          </a>
        </h2>
        <p>
          Add a small green indicator(
          <img
            class="inline mx-1 !my-0"
            src={IMGS.logo}
            height={15}
            width={15}
            alt="logo"
          />
          ) in
          <a href="https://tradingview.com">tradingview.com</a>. At the moment,
          only cover Malaysian, NYSE, Nasdaq, Shenzhen, Shanghai at the moment.
        </p>
        <p>
          Inspired from:
          <a href="https://github.com/amree/tradingview-shariah-indicators">
            https://github.com/amree/tradingview-shariah-indicators
          </a>
        </p>
        <h2 id="download">
          Download
          <a class="!ml-2" href="#download">
            #
          </a>
        </h2>
        <div class="flex flex-col gap-y-2">
          <div class="flex items-center gap-2">
            <a
              target="_blank"
              rel="noopener noreferrer"
              title="Download Tradingview Shariah indicator in Chrome now"
              href="https://chrome.google.com/webstore/detail/tradingview-shariah-indic/eogackkjbjbbmlkbakekhaanphmnpkgf?utm_source=github&utm_medium=website&utm_campaign=shariah-invest"
            >
              <img
                class="!my-0"
                src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_128x128.png"
                width="32"
              />
            </a>
            <img
              class="!my-0"
              src="https://img.shields.io/chrome-web-store/v/eogackkjbjbbmlkbakekhaanphmnpkgf?color=blue&amp;label=version"
              alt="Chrome Web Store"
            />
            <img
              class="!my-0"
              src="https://img.shields.io/chrome-web-store/users/eogackkjbjbbmlkbakekhaanphmnpkgf?color=blue"
              alt="Chrome Web Store"
            />
          </div>
          <div class="flex items-center gap-2">
            <a
              target="_blank"
              rel="noopener noreferrer"
              title="Download Tradingview Shariah indicator in Firefox now"
              href="https://addons.mozilla.org/en-US/firefox/addon/tradingview-shariah-indicator?utm_source=github&utm_medium=website&utm_campaign=shariah-invest"
            >
              <img
                class="!my-0"
                src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_128x128.png"
                width="32"
              />
            </a>
            <img
              class="!my-0"
              src="https://img.shields.io/amo/v/tradingview-shariah-indicator?color=orange&amp;label=version"
              alt="Mozilla Add-on"
            />
            <img
              class="!my-0"
              src="https://img.shields.io/amo/users/tradingview-shariah-indicator?color=orange"
              alt="Mozilla Add-on"
            />
            <img
              class="!my-0"
              src="https://img.shields.io/amo/rating/tradingview-shariah-indicator?color=orange"
              alt="Mozilla Add-on"
            />
          </div>
        </div>
        <div class="flex mt-2 gap-2">
          Also available in:
          <a
            target="_blank"
            rel="noopener noreferrer"
            title="Download Tradingview Shariah indicator in Edge now"
            href="https://support.microsoft.com/en-my/help/4027935/microsoft-edge-add-or-remove-browser-extensions"
          >
            <img
              class="!my-0"
              src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_128x128.png"
              width="24"
            />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            title="Download Tradingview Shariah indicator in Brave now"
            href="https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave-"
          >
            <img
              class="!my-0"
              src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/brave/brave_128x128.png"
              width="24"
            />
          </a>
        </div>
        <p>Installation guide:</p>
        <ol>
          <li>
            <p>Install with:</p>
            <ul>
              <li>
                <a href="https://chrome.google.com/webstore/detail/tradingview-shariah-indic/eogackkjbjbbmlkbakekhaanphmnpkgf">
                  Chrome
                </a>
              </li>
              <li>
                <a href="https://addons.mozilla.org/en-US/firefox/addon/tradingview-shariah-indicator">
                  Firefox
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/en-my/help/4027935/microsoft-edge-add-or-remove-browser-extensions">
                  Edge
                </a>
                and
                <a href="https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave-">
                  Brave
                </a>
                : Please follow this steps and then install this extension via
                chrome store.
              </li>
            </ul>
          </li>
          <li>
            Click button &quot;Add to Chrome&quot; / &quot;Add to Firefox&quot;
          </li>
          <li>
            Open <a href="https://tradingview.com">https://tradingview.com</a>
          </li>
          <li>
            Goto any of this page
            <a href="https://tradingview.com/chart">Chart</a>/
            <a href="https://tradingview.com/screener">Screener</a>/
            <a href="https://tradingview.com/symbols">Symbols</a>
          </li>
          <li>
            You can also you this page for more easy navigation
            <a href="list">list</a>
          </li>
        </ol>
        {/**/}
        <h2 id="release">
          Release{" "}
          <a class="!ml-2" href="#release">
            #
          </a>
        </h2>
        <a href="https://github.com/AzrizHaziq/tradingview-syariah-indicator/releases">
          View All Releases
        </a>

        <h2 id="screenshots">
          Screenshots{" "}
          <a class="!ml-2" href="#screenshots">
            #
          </a>
        </h2>
        <h3>
          <a href="https://www.tradingview.com/symbols/MYX-TOPGLOV/">
            Symbol Page
          </a>
        </h3>
        <img
          width="600"
          height="400"
          loading="lazy"
          class="!m-0"
          src={IMGS.chrome_symbol}
          alt="Symbol page"
        />

        <h3>
          <a href="https://www.tradingview.com/chart/">Chart page</a>
        </h3>
        <img
          width="600"
          height="400"
          loading="lazy"
          class="!m-0"
          src={IMGS.chrome_chart}
          alt="Chart page"
        />
        <img
          width="600"
          height="400"
          loading="lazy"
          class="!m-0"
          src={IMGS.chrome_chartWithScreener}
          alt="Chart page with screener"
        />

        <h3>
          <a href="https://www.tradingview.com/screener/">Screener page</a>
        </h3>
        <img
          width="600"
          height="400"
          loading="lazy"
          class="!m-0"
          src={IMGS.chrome_screener}
          alt="Screener page"
        />

        <h3 id="popup">
          Popup{" "}
          <a class="!ml-2" href="#popup">
            #
          </a>
        </h3>
        <img
          width="600"
          height="400"
          loading="lazy"
          class="!m-0"
          src={IMGS.chrome_popup}
          alt="popup"
        />

        <h2 id="video">
          Video{" "}
          <a class="!ml-2" href="#video">
            #
          </a>
        </h2>
        <a href="https://www.youtube.com/watch?v=4U8mu_5UfUQ">
          <img
            width="600"
            height="400"
            loading="lazy"
            class="!m-0"
            src="https://img.youtube.com/vi/4U8mu_5UfUQ/0.jpg"
            alt="tradingview-shariah-indicator"
          />
        </a>
      </div>
      <p class="mt-10 text-2xl text-center">
        Please feel free to contact me if any bug happen.
      </p>
    </>
  );
}
