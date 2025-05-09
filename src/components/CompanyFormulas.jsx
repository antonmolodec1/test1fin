// src/components/CompanyFormulas.jsx
import React from "react";
import { FORMULA_CATEGORIES, FORMULA_LABELS } from "../utils/formulaOrder";

export function CompanyFormulas({ data }) {
  return (
    <div>
      {FORMULA_CATEGORIES.map(({ key, title, metrics }) => (
        <section key={key} style={{ marginBottom: 24 }}>
          <h3>{title}</h3>
          <table>
            <tbody>
              {metrics.map((m) => (
                <tr key={m}>
                  <td style={{ paddingRight: 16 }}>{FORMULA_LABELS[m]}</td>
                  <td>{data[m]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
