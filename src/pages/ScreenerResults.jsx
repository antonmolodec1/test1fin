import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function ScreenerResults() {
  const { state } = useLocation();
  const data = state?.filteredData || [];

  if (!data.length) {
    return (
      <div style={{ padding: 24 }}>
        <h2>No results</h2>
        <p>Please apply filters and click Search.</p>
        <Link to="/screener">
          <button>Back to Screener</button>
        </Link>
      </div>
    );
  }

  const cols = ['ticker', 'price', 'eps', 'pe', 'sector', 'country'];

  return (
    <div style={{ padding: 24 }}>
      <h2>Search Results</h2>
      <Link to="/screener">
        <button style={{ marginBottom: 16 }}>Back to Screener</button>
      </Link>
      <table className="min-w-full border">
        <thead>
          <tr>
            {cols.map(col => (
              <th key={col} className="px-2 py-1 border">
                {col.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.ticker}>
              {cols.map(col => (
                <td key={col} className="px-2 py-1 border">
                  {col === 'ticker' ? (
                    <Link to={`/company/${row.ticker}`}>{row.ticker}</Link>
                  ) : typeof row[col] === 'number' ? (
                    row[col].toFixed(2)
                  ) : (
                    row[col] ?? '-'
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
