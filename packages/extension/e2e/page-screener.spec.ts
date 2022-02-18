import { expect, Page } from "@playwright/test";
import {
  exchanges,
  exchangeToMarket,
  Market,
  nonShariahList,
  shariahByExchange,
  test,
} from "./setup";

// const shariahButton = '#shariah-checkbox-id'
const shariahLabelButton = '[for="shariah-checkbox-id"]';

test.beforeEach(async ({ page }) => {
  await page.goto(`https://www.tradingview.com/screener/`);

  // close any modal popup
  const res = await page.evaluate(
    (s) => Promise.resolve(!!document.querySelector(s)),
    ".js-dialog__close"
  );
  if (res) await page.click(".js-dialog__close");
});

test.describe.parallel("Screener page", () => {
  test.describe("Search for", () => {
    test.beforeEach(async ({ page }) => {
      await page.click(shariahLabelButton);
    });

    shariahByExchange.forEach(([exchange, code, name]) => {
      test(`[S]: ${exchange}-${code}-${name}`, async ({ page }) => {
        await validate("table-row")([exchange, code], page);
      });
    });

    nonShariahList.forEach(([exchange, code, name]) => {
      test(`[NS]: ${exchange}-${code}-${name}`, async ({ page }) => {
        await validate("none")([exchange, code], page);
      });
    });
  });
});

test.skip("This test not working great when running multiple test, run this individually with .only", () => {
  test("Should retain active/inactive state of shariah button", async ({
    page,
  }) => {
    let res = await page.evaluate(assertOpacity, shariahLabelButton);
    expect(parseFloat(res)).toBe(0.4);

    // set shariah active
    await page.click(shariahLabelButton);
    await page.waitForTimeout(500);
    res = await page.evaluate(assertOpacity, shariahLabelButton);
    expect(parseFloat(res)).toBe(1);

    await setMarket("brazil")(page);
    res = await page.evaluate(assertDisplay, shariahLabelButton);
    expect(res).toEqual("none");

    await setMarket("USA")(page);
    await page.waitForTimeout(500);
    res = await page.evaluate(assertOpacity, shariahLabelButton);
    expect(parseFloat(res)).toBe(1);

    // set shariah inactive
    await page.click(shariahLabelButton);
    await page.waitForTimeout(500);
    res = await page.evaluate(assertOpacity, shariahLabelButton);
    expect(parseFloat(res)).toBe(0.4);

    await setMarket("brazil")(page);
    res = await page.evaluate(assertDisplay, shariahLabelButton);
    expect(res).toEqual("none");

    await setMarket("USA")(page);
    await page.waitForTimeout(500);
    res = await page.evaluate(assertOpacity, shariahLabelButton);
    expect(parseFloat(res)).toBe(0.4);
  });

  test("Shariah checkbox button should exist on US, China, Malaysia market", async ({
    page,
  }) => {
    await setMarket("canada")(page);
    let res = await page.evaluate(assertDisplay, shariahLabelButton);
    expect(res).toEqual("none");

    await setMarket("china")(page);
    res = await page.evaluate(assertDisplay, shariahLabelButton);
    expect(res).toEqual("block");

    await setMarket("indonesia")(page);
    res = await page.evaluate(assertDisplay, shariahLabelButton);
    expect(res).toEqual("none");

    await setMarket("malaysia")(page);
    res = await page.evaluate(assertDisplay, shariahLabelButton);
    expect(res).toEqual("block");

    await setMarket("brazil")(page);
    res = await page.evaluate(assertDisplay, shariahLabelButton);
    expect(res).toEqual("none");

    await setMarket("USA")(page);
    res = await page.evaluate(assertDisplay, shariahLabelButton);
    expect(res).toEqual("block");
  });
});

const validate =
  (cssDisplay: "table-row" | "none") =>
  async (
    [exchange, code]: [typeof exchanges[number], string],
    page: Page
  ): Promise<void> => {
    const market = exchangeToMarket(exchange);
    await setMarket(market)(page);

    await page.fill(".tv-screener-table__search-input.js-search-input", code);
    await page.waitForResponse(
      (resp) => resp.url().includes("/scan") && resp.ok()
    );
    await page.waitForTimeout(1000);

    const res = await page.evaluate(
      (s) =>
        Promise.resolve(
          getComputedStyle(document.querySelector(s)).getPropertyValue(
            "display"
          )
        ),
      `[data-symbol='${exchange}:${code}']`
    );

    expect(res).toEqual(cssDisplay);
  };

const setMarket =
  (market: Market) =>
  async (page: Page): Promise<void> => {
    // await page.waitForSelector(`[data-name="screener-markets"]`)

    const isMarketAlreadySelected = await page.evaluate(
      (s: string) => Promise.resolve(!!document.querySelector(s)),
      `[data-market=${
        market === "USA" ? "america" : market
      }][data-name="screener-markets"]`
    );

    if (isMarketAlreadySelected) {
      return;
    }

    // click country dropdown
    await page.click(".tv-screener-market-select > .js-screener-market-button");
    await page.fill("[placeholder=Search]", market);

    await page.click(`[data-market=${market === "USA" ? "america" : market}]`);
    await page.waitForResponse(
      (resp) => resp.url().includes("/metainfo") && resp.ok()
    );
    await page.waitForResponse(
      (resp) => resp.url().includes("/scan") && resp.ok()
    );
    await page.waitForTimeout(1000);
  };

const assertDisplay = (s: string): Promise<string> =>
  Promise.resolve(
    getComputedStyle(document.querySelector(s).parentElement).getPropertyValue(
      "display"
    )
  );

const assertOpacity = (s: string): Promise<string> =>
  Promise.resolve(
    getComputedStyle(document.querySelector(s)).getPropertyValue("opacity")
  );
