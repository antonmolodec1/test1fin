import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCompanyFundamentals } from "../hooks/useCompanyFundamentals";
import {
  loadPriceHistory,
  loadTickersByName,
  loadTickersByCategory,
  loadTickersByCountry,
} from "../api/dataLoader";
import { YearSelector } from "../components/YearSelector";
import { PriceChart } from "../components/PriceChart";
import { CompanyMetricsCategory } from "../components/CompanyMetricsCategory";
import { CompanyFormulas } from "../components/CompanyFormulas";
import { MetricHistoryViewer } from "../components/MetricHistoryViewer";
import { METRIC_LABELS, METRIC_CATEGORIES } from "../utils/metricOrder";
import { FORMULA_LABELS } from "../utils/formulaOrder";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CompanyProfile({ ticker }) {
  // Unconditional hooks
  const { fundamentals, availableYears, currentYear, setCurrentYear } =
    useCompanyFundamentals(ticker);
  const [metricsCategory, setMetricsCategory] = useState(
    METRIC_CATEGORIES[0].key
  );
  const [viewers, setViewers] = useState([0]);
  const nextId = useRef(1);
  const viewerRefs = useRef({});

  // Supplementary data
  const priceHistory = loadPriceHistory().year;
  const namesMap = loadTickersByName();
  const categories = loadTickersByCategory();
  const countries = loadTickersByCountry();
  const companyName = namesMap[ticker] || ticker;
  const sector =
    Object.keys(categories).find((s) => ticker in categories[s]) || "—";
  const country =
    Object.keys(countries).find((c) => ticker in countries[c]) || "—";

  // Handlers
  const addViewer = () => {
    setViewers((vs) => [...vs, nextId.current]);
    nextId.current += 1;
  };

  const removeViewer = (id) => {
    setViewers((vs) => vs.filter((v) => v !== id));
    delete viewerRefs.current[id];
  };

  const savePDF = async (id) => {
    const el = viewerRefs.current[id];
    if (!el) return;
    const canvas = await html2canvas(el);
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape" });
    pdf.setFontSize(18);
    pdf.text(companyName, 10, 10);
    const w = pdf.internal.pageSize.getWidth() - 20;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", 10, 20, w, h);
    pdf.save(
      `${companyName.replace(/[^a-z0-9]/gi, "_")}_history_${id}.pdf`
    );
  };

  // Early return
  if (!fundamentals) {
    return <div>Loading data…</div>;
  }

  // Prepare history
  const histUnified = Object.fromEntries(
    Object.entries(fundamentals).map(([yr, obj]) => [yr, obj["Unified Metrics"]])
  );
  const histFormulas = Object.fromEntries(
    Object.entries(fundamentals).map(([yr, obj]) => [yr, obj["Calculated Formulas"]])
  );
  const combinedHistory = {};
  Object.keys(histUnified).forEach((yr) => {
    const un = histUnified[yr];
    const fo = histFormulas[yr];
    const price = priceHistory[yr]?.[ticker] ?? null;
    const eps = un.EPS;
    combinedHistory[yr] = {
      ...un,
      ...fo,
      "P/E Ratio": eps ? price / eps : null,
    };
  });
  const combinedLabels = { ...METRIC_LABELS, ...FORMULA_LABELS };

  return (
    <div style={{ padding: 24 }}>
      {/* Navigation to Stock Screener */}
      <div style={{ marginBottom: 16 }}>
        <Link to="/screener">
          <button
            data-testid="screener-btn"
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Stock Screener
          </button>
        </Link>
      </div>

      <h1>{companyName}</h1>
      <p style={{ color: "#666", margin: "4px 0 24px" }}>
        Sector: {sector} | Country: {country}
      </p>

      <section style={{ margin: "32px 0" }}>
        <h2>Annual Price History</h2>
        <PriceChart history={priceHistory} ticker={ticker} />
      </section>

      <section style={{ margin: "16px 0" }}>
        <label htmlFor="year-select" style={{ marginRight: 8 }}>
          Select Year:
        </label>
        <YearSelector
          id="year-select"
          years={availableYears}
          value={currentYear}
          onChange={setCurrentYear}
        />
      </section>

      <div style={{ display: "flex", gap: 32, marginTop: 32 }}>
        {/* LEFT COLUMN: Metrics and Formulas */}
        <div style={{ flex: 1 }}>
          <section style={{ marginBottom: 32 }}>
            <h2>Key Financials</h2>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {METRIC_CATEGORIES.map(({ key, title }) => (
                <button
                  key={key}
                  onClick={() => setMetricsCategory(key)}
                  style={{
                    padding: "6px 12px",
                    background:
                      metricsCategory === key ? "#ddd" : "transparent",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  {title}
                </button>
              ))}
            </div>
            <CompanyMetricsCategory
              categoryKey={metricsCategory}
              data={fundamentals[currentYear]["Unified Metrics"]}
            />
          </section>

          <section>
            <h2>Financial Ratios</h2>
            {(() => {
              const base = fundamentals[currentYear]["Calculated Formulas"];
              const price = priceHistory[currentYear]?.[ticker] ?? null;
              const eps = fundamentals[currentYear]["Unified Metrics"].EPS;
              const peValue = eps && price != null ? price / eps : null;
              const peFormatted =
                peValue != null ? Number(peValue.toFixed(2)) : null;
              const withPE = { ...base, "P/E Ratio": peFormatted };
              return <CompanyFormulas data={withPE} />;
            })()}
          </section>
        </div>

        {/* RIGHT COLUMN: History Viewers */}
        <div style={{ flex: 1 }}>
          {viewers.map((id) => (
            <div
              key={id}
              ref={(el) => (viewerRefs.current[id] = el)}
              style={{
                position: "relative",
                marginBottom: 32,
                padding: 16,
                border: "1px solid #eee",
                borderRadius: 4,
              }}
            >
              <button
                onClick={() => removeViewer(id)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "transparent",
                  border: "none",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>

              <MetricHistoryViewer
                data={combinedHistory}
                labels={combinedLabels}
                title={`Viewer #${id + 1}`}
              />

              <button
                onClick={() => savePDF(id)}
                style={{
                  marginTop: 8,
                  padding: "6px 12px",
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Save to PDF
              </button>
            </div>
          ))}

          <button
            onClick={addViewer}
            style={{
              padding: "8px 16px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Add History Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
