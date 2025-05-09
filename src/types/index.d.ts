// Объявляем, что можно импортировать .json-файлы
declare module "*.json" {
    const value: any;
    export default value;
  }
  
  // ------------------------------------------------------
  // 1) PriceHistory: год → { [ticker]: число }
  export interface PriceHistory {
    year: Record<string, Record<string, number>>;
  }
  
  // 2) Списки тикеров
  export type TickersByCategory = Record<string, Record<string, string>>;
  export type TickersByCountry  = Record<string, Record<string, string>>;
  export type TickersByCurrency = Record<string, Record<string, string>>;
  export type TickersByName     = Record<string, string>;
  
  // ------------------------------------------------------
  // 3) Фундаментальные данные компании за год
  export interface UnifiedMetrics {
    Revenue: number;
    CostOfGoodsSold: number;
    GrossProfit: number;
    OperatingIncome: number;
    EBIT: number;
    DepreciationAndAmortization: number;
    EBITDA: number;
    NetIncome: number;
    EPS: number;
    TotalAssets: number;
    CurrentAssets: number;
    NonCurrentAssets: number;
    CurrentLiabilities: number;
    NonCurrentLiabilities: number;
    TotalLiabilities: number;
    StockholdersEquity: number;
    InvestedCapital: number;
    CurrentFinancialDebt: number;
    NonCurrentFinancialDebt: number;
    TotalDebt: number;
    CashAndCashEquivalents: number;
    Inventory: number;
    OperatingCashFlow: number;
  }
  
  export interface CalculatedFormulas {
    CurrentRatio: number;
    QuickRatio: number;
    CashRatio: number;
    DebtToEquityRatio: number;
    DebtToAssetsRatio: number;
    AssetTurnoverRatio: number;
    GrossProfitMargin: number;
    OperatingMargin: number;
    NetProfitMargin: number;
    ReturnOnEquity: number;
    ReturnOnAssets: number;
    ReturnOnInvestedCapital: number;
    EquityToAssetsRatio: number;
    OperatingCashFlowToRevenue: number;
    LeverageRatio: number;
    EPS: number;
  }
  
  // CompanyFundamentals: год → { Unified Metrics + Calculated Formulas }
  export type CompanyFundamentals = Record<
    string,
    {
      "Unified Metrics": UnifiedMetrics;
      "Calculated Formulas": CalculatedFormulas;
    }
  >;
  