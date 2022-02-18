import { expect } from "@playwright/test";
import { nonShariahList, shariahByExchange, test } from "./setup";

// const symbolSelector = `[data-name=legend] [data-name=legend-series-item] svg`
const selector =
  '[data-name=legend] [data-name=legend-series-item] [data-indicator="tradingview-shariah-indicator"]';

const chartPage =
  (assert: "toBeTruthy" | "toBeFalsy") =>
  ([exchange, code, name]) => {
    test(`${
      assert === "toBeTruthy" ? "[S]" : "[NS]"
    }: ${exchange}-${code}-${name}`, async ({ page }) => {
      const url = `https://www.tradingview.com/chart?symbol=${encodeURIComponent(
        exchange + ":" + code
      )}`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForSelector(".layout__area--center [data-name=legend]");
      const bool = await page.evaluate(
        (s: string) => Promise.resolve(!!document.querySelector(s)),
        selector
      );

      expect(bool)[assert]();
    });
  };

test.describe.parallel("Chart page", () => {
  shariahByExchange.forEach(chartPage("toBeTruthy"));
  nonShariahList.forEach(chartPage("toBeFalsy"));
});
