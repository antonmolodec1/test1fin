// src/components/CompanyMetricsCategory.jsx
import React from "react";
import { METRIC_CATEGORIES, METRIC_LABELS } from "../utils/metricOrder";

/**
 * Рендерит только одну выбранную категорию метрик.
 * @param {{ categoryKey: string, data: Record<string, number> }} props
 */
export function CompanyMetricsCategory({ categoryKey, data }) {
  const category = METRIC_CATEGORIES.find((c) => c.key === categoryKey);
  if (!category) return null;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: "8px" }}>{category.title}</th>
          <th style={{ textAlign: "right", padding: "8px" }}>Value</th>
        </tr>
      </thead>
      <tbody>
        {category.metrics.map((m) => (
          <tr key={m}>
            <td style={{ padding: "8px 8px 8px 0" }}>{METRIC_LABELS[m]}</td>
            <td style={{ padding: "8px 0 8px 8px", textAlign: "right" }}>
              {data[m]?.toLocaleString?.() ?? data[m]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
