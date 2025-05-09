// src/components/SearchBar.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadTickersByName } from "../api/dataLoader";

export function SearchBar() {
  // Словарь ticker→company name
  const all = useMemo(() => loadTickersByName(), []);
  const options = useMemo(
    () => Object.entries(all).map(([ticker, name]) => ({ ticker, name })),
    [all]
  );

  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return setFiltered([]);
    setFiltered(
      options.filter(
        ({ name, ticker }) =>
          name.toLowerCase().includes(q) ||
          ticker.toLowerCase().includes(q)
      )
    );
  }, [query, options]);

  const handleSelect = (ticker) => {
    // Сброс поля и списка
    setQuery("");
    setFiltered([]);
    // Клиентский переход на страницу компании
    navigate(`/company/${ticker}`);
  };

  return (
    <div style={{ position: "relative", margin: "16px 0" }}>
      <input
        type="text"
        placeholder="Search company..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
      />
      {filtered.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            border: "1px solid #ccc",
            background: "#fff",
            position: "absolute",
            width: "100%",
            maxHeight: 200,
            overflowY: "auto",
            zIndex: 100,
          }}
        >
          {filtered.map(({ ticker, name }) => (
            <li
              key={ticker}
              style={{ padding: "4px 8px", cursor: "pointer" }}
              onClick={() => handleSelect(ticker)}
            >
              {name} ({ticker})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
