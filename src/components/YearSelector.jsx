// src/components/YearSelector.jsx
import React from "react";

export function YearSelector({ id, years, value, onChange }) {
  return (
    <select
      id={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ fontSize: 14, padding: "4px 8px" }}
    >
      {years.map(y => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  );
}
