// src/components/CompanyMetrics.jsx
import React from "react";
import { METRIC_CATEGORIES, METRIC_LABELS } from "../utils/metricOrder";

export function CompanyMetrics({ data }) {
  return (
    <div style={{ display: "flex", gap: 32 }}>
      {METRIC_CATEGORIES.map(({ key, title, metrics }) => (
        <section key={key} style={{ flex: 1 }}>
          <h3>{title}</h3>
          <table>
            <tbody>
              {metrics.map((m) => (
                <tr key={m}>
                  <td style={{ paddingRight: 16 }}>{METRIC_LABELS[m]}</td>
                  <td>{data[m]?.toLocaleString?.() ?? data[m]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
