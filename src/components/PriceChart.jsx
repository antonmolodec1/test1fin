// src/components/PriceChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export function PriceChart({ history, ticker }) {
  // Формируем массив годов и сортируем их
  const years = Object.keys(history).sort((a, b) => a.localeCompare(b));

  // Строим data в формате [{ year: '2015', price: ... }, ...]
  const data = years.map((year) => ({
    year,
    price: history[year][ticker] ?? null,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          ticks={years}
          interval={0}
          angle={-45}
          textAnchor="end"
        />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="price" dot={false} connectNulls />
      </LineChart>
    </ResponsiveContainer>
  );
}
