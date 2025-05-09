// src/hooks/useCompanyFundamentals.js
import { useState, useEffect } from "react";
import { loadCompanyFundamentals } from "../api/dataLoader";

export function useCompanyFundamentals(ticker) {
  const [fundamentals, setFundamentals] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    if (!ticker) {
      setFundamentals(null);
      setAvailableYears([]);
      setCurrentYear("");
      return;
    }
    (async () => {
      try {
        const data = await loadCompanyFundamentals(ticker);
        setFundamentals(data);
        const years = Object.keys(data)
          .sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
        setAvailableYears(years);
        setCurrentYear(years[0]);
      } catch {
        setFundamentals(null);
        setAvailableYears([]);
        setCurrentYear("");
      }
    })();
  }, [ticker]);

  return { fundamentals, availableYears, currentYear, setCurrentYear };
}
