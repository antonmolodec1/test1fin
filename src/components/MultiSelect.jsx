import React from 'react';

/**
 * props:
 *  - options: { value, label }[]
 *  - values: value[]
 *  - onChange: (values: value[]) => void
 *  - placeholder: string
 */
export default function MultiSelect({ options, values, onChange, placeholder }) {
  const handleChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(o => o.value);
    onChange(selected);
  };

  return (
    <select
      multiple
      value={values}
      onChange={handleChange}
      style={{
        width: '100%',
        padding: '0.5rem',
        borderRadius: '0.25rem',
        border: '1px solid #ccc',
        minHeight: '4rem',
      }}
    >
      {options.length === 0 && (
        <option disabled>{placeholder}</option>
      )}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
