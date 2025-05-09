// src/pages/CompareCompanies.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  loadTickersByName,
  loadCompanyFundamentals,
  loadPriceHistory,
} from '../api/dataLoader';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const COLORS = [
  '#8884d8','#82ca9d','#ffc658','#ff7300',
  '#413ea0','#e91e63','#00bcd4','#ff5722',
];

function ComparisonPanel({
  tickerNameMap,
  companyOptions,
  parameterOptions,
  priceHistory,
  addScreen,
}) {
  const chartRef = useRef(null);
  const [companyInputs, setCompanyInputs]     = useState(['']);
  const [parameterInputs, setParameterInputs] = useState(['']);
  const [chartData, setChartData]             = useState([]);

  useEffect(() => {
    const sels   = companyInputs.filter(Boolean);
    const params = parameterInputs.filter(Boolean);
    if (!sels.length || !params.length) {
      setChartData([]);
      return;
    }
    (async () => {
      const allData = {};
      for (let t of sels) {
        const mod = await loadCompanyFundamentals(t);
        allData[t] = mod.default || mod;
      }
      const years = Object.keys(priceHistory).sort();
      const data = years.map((year) => {
        const point = { year };
        sels.forEach((t) =>
          params.forEach((p, pi) => {
            let val = null;
            if (p === 'Price') {
              val = priceHistory[year]?.[t] ?? null;
            } else if (p === 'P/E') {
              const price = priceHistory[year]?.[t];
              const eps =
                allData[t][year]?.['Unified Metrics']?.EPS ?? null;
              if (price != null && eps) {
                const ratio = price / eps;
                val = ratio < 0 ? 0 : +ratio.toFixed(2);
              }
            } else {
              const yData = allData[t][year] || {};
              if (yData['Unified Metrics']?.[p] != null) {
                val = yData['Unified Metrics'][p];
              } else if (
                yData['Calculated Formulas']?.[p] != null
              ) {
                val = yData['Calculated Formulas'][p];
              }
            }
            point[`${t}_${pi}`] = val;
          })
        );
        return point;
      });
      setChartData(data);
    })();
  }, [companyInputs, parameterInputs, priceHistory]);

  // handlers
  const addCompany    = () => setCompanyInputs([...companyInputs, '']);
  const removeCompany = (i)  => setCompanyInputs(companyInputs.filter((_, idx) => idx !== i));
  const changeCompany = (i,v)=> {
    const arr = [...companyInputs]; arr[i]=v; setCompanyInputs(arr);
  };

  const addParam    = () => parameterInputs.length < 3 && setParameterInputs([...parameterInputs, '']);
  const removeParam = (i)  => setParameterInputs(parameterInputs.filter((_, idx) => idx !== i));
  const changeParam = (i,v)=> {
    const arr = [...parameterInputs]; arr[i]=v; setParameterInputs(arr);
  };

  const handleExportPDF = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const img    = canvas.toDataURL('image/png');
    const pdf    = new jsPDF({ orientation: 'landscape' });
    const w      = pdf.internal.pageSize.getWidth();
    const h      = (canvas.height * w) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, w, h);
    pdf.save('comparison-chart.pdf');
  };

  const validCompanies = companyInputs.filter(Boolean);
  const validParams    = parameterInputs.filter(Boolean);

  return (
    <Card style={{ marginBottom: 24, padding: 0 }}>
      <CardContent>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {/* Companies */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <label className="block mb-2 font-medium">Companies</label>
            <div className="p-3 border rounded-lg space-y-2">
              {companyInputs.map((sel, i) => (
                <div key={i} className="flex gap-2">
                  <select
                    value={sel}
                    onChange={(e) => changeCompany(i, e.target.value)}
                    className="
                      flex-1
                      appearance-none
                      bg-white
                      border border-gray-300
                      rounded-lg
                      px-4 py-2
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition
                    "
                  >
                    <option value="">— Select company —</option>
                    {companyOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <Button variant="secondary" onClick={() => removeCompany(i)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="primary" onClick={addCompany}>
                Add Company
              </Button>
            </div>
          </div>

          {/* Parameters */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <label className="block mb-2 font-medium">
              Parameters (max 3)
            </label>
            <div className="p-3 border rounded-lg space-y-2">
              {parameterInputs.map((sel, i) => (
                <div key={i} className="flex gap-2">
                  <select
                    value={sel}
                    onChange={(e) => changeParam(i, e.target.value)}
                    className="
                      flex-1
                      appearance-none
                      bg-white
                      border border-gray-300
                      rounded-lg
                      px-4 py-2
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition
                    "
                  >
                    <option value="">— Select parameter —</option>
                    {parameterOptions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <Button variant="secondary" onClick={() => removeParam(i)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="primary"
                onClick={addParam}
                disabled={parameterInputs.length >= 3}
              >
                Add Parameter
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* BarChart */}
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: 400,
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 16,
          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.1)',
        }}
      >
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              {validCompanies.map((ticker, ti) =>
                validParams.map((param, pi) => (
                  <Bar
                    key={`${ticker}_${pi}`}
                    dataKey={`${ticker}_${pi}`}
                    name={`${tickerNameMap[ticker] || ticker} ${param}`}
                    fill={
                      COLORS[
                        (ti * validParams.length + pi) % COLORS.length
                      ]
                    }
                  />
                ))
              )}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Please add at least one company and one parameter.
          </div>
        )}
      </div>

      {/* Export & Add Screen */}
      <div className="flex justify-between p-4">
        <Button variant="primary" onClick={handleExportPDF}>
          Export to PDF
        </Button>
        <Button variant="primary" onClick={addScreen}>
          Add Comparison Screen
        </Button>
      </div>
    </Card>
  );
}

export default function CompareCompanies() {
  const [panelIds, setPanelIds] = useState([0]);
  const addScreen = () =>
    setPanelIds((prev) => [...prev, prev.length]);

  const [tickerNameMap, setTickerNameMap]       = useState({});
  const [companyOptions, setCompanyOptions]     = useState([]);
  const [parameterOptions, setParameterOptions] = useState([]);
  const [priceHistory, setPriceHistory]         = useState({});

  useEffect(() => {
    const mapping = loadTickersByName();
    setTickerNameMap(mapping);
    setCompanyOptions(
      Object.entries(mapping).map(([t, name]) => ({
        value: t,
        label: `${name} (${t})`,
      }))
    );

    const ph = loadPriceHistory();
    setPriceHistory(ph.year);

    const tickers = Object.keys(mapping);
    if (tickers.length) {
      loadCompanyFundamentals(tickers[0]).then((mod) => {
        const data   = mod.default || mod;
        const years  = Object.keys(data).sort();
        const latest = years[years.length - 1];
        const um = data[latest]['Unified Metrics'] || {};
        const cf = data[latest]['Calculated Formulas'] || {};
        const params = Array.from(
          new Set([...Object.keys(um), ...Object.keys(cf)])
        );
        setParameterOptions([...params, 'Price', 'P/E']);
      });
    }
  }, []);

  return (
    <>
      {panelIds.map((id) => (
        <ComparisonPanel
          key={id}
          tickerNameMap={tickerNameMap}
          companyOptions={companyOptions}
          parameterOptions={parameterOptions}
          priceHistory={priceHistory}
          addScreen={addScreen}
        />
      ))}
    </>
  );
}
