// src/components/ui/FancyButton.jsx

import React from 'react';

/**
 * FancyButton — использует глобальный .btn и .btn-1 из buttonEffects.scss
 * Можно дополнить пропсами href или onClick.
 */
export function FancyButton({ children, onClick, href, ...props }) {
  // если передан href — используем <a>, иначе <button>
  const Tag = href ? 'a' : 'button';
  const tagProps = href ? { href } : { onClick };

  return (
    <Tag
      className="btn btn-1"
      {...tagProps}
      {...props}
    >
      <svg>
        <rect x="0" y="0" width="100%" height="100%" />
      </svg>
      {children}
    </Tag>
  );
}
