// src/utils/formulaOrder.js

export const FORMULA_LABELS = {
    "Current Ratio":                  "Current Ratio",
    "Quick Ratio":                    "Quick Ratio",
    "Cash Ratio":                     "Cash Ratio",
  
    "Debt-to-Equity Ratio":           "Debt-to-Equity Ratio",
    "Debt-to-Assets Ratio":           "Debt-to-Assets Ratio",
    "Equity-to-Assets Ratio":         "Equity-to-Assets Ratio",
    "Leverage Ratio":                 "Leverage Ratio",
  
    "Asset Turnover Ratio":           "Asset Turnover Ratio",
    "Operating Cash Flow to Revenue": "OCF/Revenue",
  
    "Gross Profit Margin":            "Gross Profit Margin, %",
    "Operating Margin":               "Operating Margin, %",
    "Net Profit Margin":              "Net Profit Margin, %",
  
    "Return on Equity (ROE)":         "ROE, %",
    "Return on Assets (ROA)":         "ROA, %",
    "Return on Invested Capital (ROIC)":"ROIC, %",
  
    "EPS":                            "EPS",
    // добавим P/E
    "P/E Ratio":                      "P/E Ratio",
  };
  
  export const FORMULA_CATEGORIES = [
    {
      key: "liquidity",
      title: "Liquidity",
      metrics: [
        "Current Ratio",
        "Quick Ratio",
        "Cash Ratio",
      ],
    },
    {
      key: "solvency",
      title: "Solvency",
      metrics: [
        "Debt-to-Equity Ratio",
        "Debt-to-Assets Ratio",
        "Equity-to-Assets Ratio",
        "Leverage Ratio",
      ],
    },
    {
      key: "efficiency",
      title: "Efficiency",
      metrics: [
        "Asset Turnover Ratio",
        "Operating Cash Flow to Revenue",
      ],
    },
    {
      key: "profitability",
      title: "Profitability",
      metrics: [
        "Gross Profit Margin",
        "Operating Margin",
        "Net Profit Margin",
        "Return on Equity (ROE)",
        "Return on Assets (ROA)",
        "Return on Invested Capital (ROIC)",
      ],
    },
    {
      key: "other",
      title: "Other",
      metrics: [
        "EPS",
        "P/E Ratio",   // переносим сюда
      ],
    },
  ];
  