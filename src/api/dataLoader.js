// src/api/dataLoader.js
import priceHistoryData  from "../assets/data/price_history.json";
import tickersByNameData from "../assets/data/ticker_by_name.json";
import tickersByCategory from "../assets/data/ticker_by_category.json";
import tickersByCountry  from "../assets/data/ticker_by_country.json";
import tickersByCurrency from "../assets/data/ticker_by_currency.json";

export function loadPriceHistory() {
  return priceHistoryData;
}
export function loadTickersByName() {
  return tickersByNameData;
}
export function loadTickersByCategory() {
  return tickersByCategory;
}
export function loadTickersByCountry() {
  return tickersByCountry;
}
export function loadTickersByCurrency() {
  return tickersByCurrency;
}

export async function loadCompanyFundamentals(ticker) {
    try {
      // берём ticker напрямую, без replace
      const module = await import(
        /* webpackChunkName: "fundamentals-[request]" */
        `../assets/data/${ticker}.json`
      );
      return module.default;
    } catch (err) {
      console.error(`Failed to load fundamentals for ${ticker}:`, err);
      throw err;
    }
  }