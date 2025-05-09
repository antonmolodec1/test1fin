// src/pages/StockScreener.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  loadTickersByName,
  loadTickersByCategory,
  loadTickersByCountry,
  loadTickersByCurrency,
  loadPriceHistory,
  loadCompanyFundamentals
} from '../api/dataLoader';
import { Button } from '../components/ui/button'; // вернута обычная кнопка :contentReference[oaicite:0]{index=0}

const PAGE_SIZE = 20;
const FUND_YEAR = '2024';

export default function StockScreener() {
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sector, setSector] = useState('All');
  const [country, setCountry] = useState('All');
  const [currency, setCurrency] = useState('All');
  const [availableSectors, setAvailableSectors] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [metricsMap, setMetricsMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'desc' });

  // 1. Load base data + latest prices
  useEffect(() => {
    const nameMap     = loadTickersByName();
    const categoryMap = loadTickersByCategory();
    const countryMap  = loadTickersByCountry();
    const currencyMap = loadTickersByCurrency();
    const priceData   = loadPriceHistory().year || {};

    setAvailableSectors(['All', ...Object.keys(categoryMap).sort()]);
    setAvailableCountries(['All', ...Object.keys(countryMap).sort()]);
    setAvailableCurrencies(['All', ...Object.keys(currencyMap).sort()]);

    const tickerTo = { sector: {}, country: {}, currency: {} };
    Object.entries(categoryMap).forEach(([sec, list]) =>
      (Array.isArray(list) ? list : Object.keys(list)).forEach(t => tickerTo.sector[t] = sec)
    );
    Object.entries(countryMap).forEach(([cou, list]) =>
      (Array.isArray(list) ? list : Object.keys(list)).forEach(t => tickerTo.country[t] = cou)
    );
    Object.entries(currencyMap).forEach(([cur, list]) =>
      (Array.isArray(list) ? list : Object.keys(list)).forEach(t => tickerTo.currency[t] = cur)
    );

    const years = Object.keys(priceData);
    const latest = years.length ? years.sort().pop() : null;

    const comps = Object.entries(nameMap).map(([ticker, name]) => ({
      ticker,
      name,
      sector:   tickerTo.sector[ticker]   || 'N/A',
      country:  tickerTo.country[ticker]  || 'N/A',
      currency: tickerTo.currency[ticker] || 'N/A',
      price:    latest && priceData[latest][ticker] != null
                ? priceData[latest][ticker]
                : null
    }));
    setCompanies(comps);
  }, []);

  // 2. Load metrics for the visible page
  useEffect(() => {
    async function loadMetrics() {
      const pageSlice = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
      const newMap = {};
      await Promise.all(
        pageSlice.map(async ({ ticker }) => {
          try {
            const data = await loadCompanyFundamentals(ticker);
            const yr = data[FUND_YEAR] || {};
            newMap[ticker] = {
              debtToEquity:    yr['Calculated Formulas']?.['Debt-to-Equity Ratio'] ?? null,
              netProfitMargin: yr['Calculated Formulas']?.['Net Profit Margin'] ?? null,
              eps:             yr['Unified Metrics']?.['EPS'] ?? null
            };
          } catch {
            newMap[ticker] = { debtToEquity: null, netProfitMargin: null, eps: null };
          }
        })
      );
      setMetricsMap(prev => ({ ...prev, ...newMap }));
    }
    loadMetrics();
  }, [filtered, currentPage]);

  // 3. Filtering
  useEffect(() => {
    const res = companies.filter(c => {
      const term = searchTerm.toLowerCase();
      const okSearch   = c.ticker.toLowerCase().includes(term) || c.name.toLowerCase().includes(term);
      const okSector   = sector   === 'All' || c.sector   === sector;
      const okCountry  = country  === 'All' || c.country  === country;
      const okCurrency = currency === 'All' || c.currency === currency;
      return okSearch && okSector && okCountry && okCurrency;
    });
    setFiltered(res);
    setCurrentPage(1);
  }, [companies, searchTerm, sector, country, currency]);

  // 4. Sorting
  const sortedItems = useMemo(() => {
    const { field, direction } = sortConfig;
    if (!field) return filtered;
    const mapper = row => {
      const m = metricsMap[row.ticker] || {};
      switch (field) {
        case 'ticker': return row.ticker;
        case 'name':   return row.name;
        case 'price':  return row.price ?? -Infinity;
        case 'pe':     return row.price != null && m.eps ? row.price / m.eps : -Infinity;
        case 'de':     return m.debtToEquity ?? -Infinity;
        case 'npm':    return m.netProfitMargin ?? -Infinity;
        case 'sector': return row.sector;
        case 'country':return row.country;
        default:       return '';
      }
    };
    return [...filtered].sort((a, b) => {
      const aVal = mapper(a), bVal = mapper(b);
      if (typeof aVal === 'string') {
        return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filtered, metricsMap, sortConfig]);

  const pageCount = Math.ceil(sortedItems.length / PAGE_SIZE);
  const pageItems = sortedItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = field =>
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  const sortIcon = field =>
    sortConfig.field === field ? (sortConfig.direction === 'desc' ? '↓' : '↑') : '';

  // 5. Columns definition
  const columns = [
    { key: 'ticker', label: 'Ticker' },
    { key: 'name',   label: 'Company' },
    { key: 'price',  label: 'Price' },
    { key: 'pe',     label: 'P/E (2024)' },
    { key: 'de',     label: 'D/E (2024)' },
    { key: 'npm',    label: 'Net Profit Margin (2024)' },
    { key: 'sector', label: 'Sector' },
    { key: 'country',label: 'Country' }
  ];

  const renderCell = (col, item) => {
    const m = metricsMap[item.ticker] || {};
    switch (col) {
      case 'ticker':
        return (
          <Link to={`/company/${item.ticker}`} className="text-blue-600 hover:underline font-medium">
            {item.ticker}
          </Link>
        );
      case 'name':   return item.name;
      case 'price':  return item.price != null ? item.price.toFixed(2) : '-';
      case 'pe':     return item.price != null && m.eps ? (item.price / m.eps).toFixed(2) : '-';
      case 'de':     return m.debtToEquity != null ? m.debtToEquity.toFixed(2) : '-';
      case 'npm':    return m.netProfitMargin != null ? m.netProfitMargin.toFixed(2) + '%' : '-';
      case 'sector': return item.sector;
      case 'country':return item.country;
      default:       return '';
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Stock Screener</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          className="px-3 py-2 border rounded shadow-sm"
          placeholder="Search ticker or name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          className="px-3 py-2 border rounded shadow-sm"
          value={sector}
          onChange={e => setSector(e.target.value)}
        >
          {availableSectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className="px-3 py-2 border rounded shadow-sm"
          value={country}
          onChange={e => setCountry(e.target.value)}
        >
          {availableCountries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          className="px-3 py-2 border rounded shadow-sm"
          value={currency}
          onChange={e => setCurrency(e.target.value)}
        >
          {availableCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="
                    px-4 py-3
                    border border-gray-300
                    bg-blue-50 text-left font-semibold
                    cursor-pointer select-none
                    hover:bg-blue-100
                  "
                >
                  {col.label} {sortIcon(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map(item => (
              <tr key={item.ticker} className="even:bg-gray-100 hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-2 border border-gray-300">
                    {renderCell(col.key, item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="secondary"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        <span className="text-lg font-medium">
          Page {currentPage} of {pageCount}
        </span>
        <Button
          variant="secondary"
          onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
          disabled={currentPage === pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
