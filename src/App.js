// src/App.js
import React, { useState } from "react";
import { Routes, Route, Navigate, Link, useParams } from "react-router-dom";
import { SearchBar }          from "./components/SearchBar";
import CompanyProfile         from "./pages/CompanyProfile";
import StockScreener          from "./pages/StockScreener";
import ScreenerResults        from "./pages/ScreenerResults";
import CompareCompanies       from "./pages/CompareCompanies"; // ← new import

// Обёрточный маршрут для CompanyProfile по URL /company/:ticker
function CompanyProfileRoute() {
  const { ticker } = useParams();
  return <CompanyProfile ticker={ticker} />;
}

export default function App() {
  const [ticker, setTicker] = useState("ADS.DE");

  return (
    <>
      <nav style={{ display: "flex", gap: 16, padding: 16 }}>
        <Link to="/">Home</Link>
        <Link to={`/company/${ticker}`}>Dashboard</Link>
        <Link to="/screener">Stock Screener</Link>
        <Link to="/compare">Compare</Link> {/* ← new nav link */}
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        <h1 style={{ textAlign: "center" }}>Stock Analyzer</h1>
        {/* глобальный поиск по тикеру */}
        <SearchBar onSelect={(t) => setTicker(t)} />

        <Routes>
          {/* при заходе на корень — сразу на профиль выбранного тикера */}
          <Route path="/" element={<Navigate to={`/company/${ticker}`} replace />} />

          {/* Профиль компании */}
          <Route path="/company/:ticker" element={<CompanyProfileRoute />} />

          {/* Screener: этап ввода фильтров */}
          <Route path="/screener" element={<StockScreener />} />

          {/* Screener: вывод отфильтрованных результатов */}
          <Route path="/screener/results" element={<ScreenerResults />} />

          {/* Compare Companies page */}
          <Route path="/compare" element={<CompareCompanies />} />

          {/* всё остальное — на главную */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
