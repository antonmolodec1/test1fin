// src/utils/metricOrder.js

// Человеко-читабельные подписи (ключи точно совпадают с JSON)
export const METRIC_LABELS = {
    "Revenue":                       "Revenue",
    "Cost of Goods Sold":           "Cost of Goods Sold",
    "Gross Profit":                 "Gross Profit",
    "Operating Income":             "Operating Income",
    "EBIT":                         "EBIT",
    "Depreciation and Amortization":"Depreciation & Amortization",
    "EBITDA":                       "EBITDA",
    "Net Income":                   "Net Income",
    "EPS":                          "EPS",
  
    "Total Assets":                 "Total Assets",
    "Current Assets":               "Current Assets",
    "Non-current Assets":           "Non-current Assets",
    "Current Liabilities":          "Current Liabilities",
    "Non-current Liabilities":      "Non-current Liabilities",
    "Total Liabilities":            "Total Liabilities",
    "Stockholders Equity":          "Stockholders’ Equity",
    "Invested Capital":             "Invested Capital",
    "Current Financial Debt":       "Current Financial Debt",
    "Non-current Financial Debt":   "Non-current Financial Debt",
    "Total Debt":                   "Total Debt",
    "Cash and Cash Equivalents":    "Cash & Cash Equivalents",
    "Inventory":                    "Inventory",
  
    "Operating Cash Flow":          "Operating Cash Flow",
  };
  
  // Группировка по секциям
  export const METRIC_CATEGORIES = [
    {
      key: "pnl",
      title: "P&L",
      metrics: [
        "Revenue",
        "Cost of Goods Sold",
        "Gross Profit",
        "Operating Income",
        "EBIT",
        "Depreciation and Amortization",
        "EBITDA",
        "Net Income",
        "EPS",
      ],
    },
    {
      key: "balance",
      title: "Balance Sheet",
      metrics: [
        "Total Assets",
        "Current Assets",
        "Non-current Assets",
        "Current Liabilities",
        "Non-current Liabilities",
        "Total Liabilities",
        "Stockholders Equity",
        "Invested Capital",
        "Current Financial Debt",
        "Non-current Financial Debt",
        "Total Debt",
        "Cash and Cash Equivalents",
        "Inventory",
      ],
    },
    {
      key: "cashflow",
      title: "Cash Flow",
      metrics: ["Operating Cash Flow"],
    },
  ];
  