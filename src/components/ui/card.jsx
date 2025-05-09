import React from 'react';

/**
 * Простая «карточка» с тенью и скруглениями.
 * props:
 *  - className: дополнительные классы Tailwind
 *  - children
 */
export function Card({ className = '', children }) {
  return (
    <div className={`bg-white shadow-md rounded-2xl p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}
