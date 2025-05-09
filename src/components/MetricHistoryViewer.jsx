// src/components/MetricHistoryViewer.jsx
import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Цветовая палитра для линий
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#d0ed57",
  "#a4de6c",
  "#8dd1e1",
  "#83a6ed",
  "#8e4585",
  "#ff7300",
  "#387908",
];

export function MetricHistoryViewer({ data, labels, title }) {
  // список всех годов
  const years = Object.keys(data).sort((a, b) => a.localeCompare(b));
  // все ключи метрик/формул
  const metricKeys = Object.keys(labels);

  // какие метрики выбраны
  const [selected, setSelected] = useState([]);
  // открыто ли меню выбора
  const [open, setOpen] = useState(false);

  const toggleMetric = (key) =>
    setSelected((s) =>
      s.includes(key) ? s.filter((m) => m !== key) : [...s, key]
    );

  // строим данные для графика
  const chartData = years.map((year) => {
    const row = { year };
    selected.forEach((key) => {
      row[key] = data[year][key] ?? null;
    });
    return row;
  });

  return (
    <div style={{ flex: 1, marginLeft: 32 }}>
      <h3>{title} History</h3>

      {/* Кнопка открытия/закрытия меню */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ marginBottom: 8, padding: "6px 12px" }}
      >
        {open ? "Hide metrics" : "Select metrics"}
      </button>

      {open && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 16px 0",
            maxHeight: 200,
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        >
          {metricKeys.map((key) => (
            <li
              key={key}
              onClick={() => toggleMetric(key)}
              style={{
                padding: "4px 8px",
                cursor: "pointer",
                textDecoration: selected.includes(key)
                  ? "line-through"
                  : "none",
              }}
            >
              {labels[key]}
            </li>
          ))}
        </ul>
      )}

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />

          {selected.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={labels[key]}
              stroke={COLORS[i % COLORS.length]}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
