// src/components/ui/button.jsx
import React from 'react';

/**
 * Button component with variants: primary, secondary, tab.
 * — крупные угловатые кнопки с тенями и фокусным кольцом.
 * — variant="primary" | "secondary" | "tab"
 * — active only for tab (зажато/не зажато)
 */
export function Button({
  onClick,
  variant = 'primary',
  active = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  // Базовые стили: размер, скругление, тень, фокусное кольцо
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'px-6',
    'py-3',
    'font-semibold',
    'rounded-lg',
    'shadow-md',
    'transition',
    'duration-150',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2'
  ].join(' ');

  // Варианты оформления
  const variantClasses = {
    primary: [
      'bg-blue-600',
      'text-white',
      'hover:bg-blue-700',
      'focus:ring-blue-500'
    ].join(' '),

    secondary: [
      'bg-white',
      'text-gray-800',
      'border',
      'border-gray-300',
      'hover:bg-gray-100',
      'focus:ring-gray-400'
    ].join(' '),

    tab: active
      ? [
          'bg-gray-200',
          'text-gray-900',
          'hover:bg-gray-300',
          'focus:ring-gray-400'
        ].join(' ')
      : [
          'bg-transparent',
          'text-gray-600',
          'hover:text-gray-800',
          'focus:ring-gray-400'
        ].join(' ')
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const classes = [baseClasses, variantClasses[variant], disabledClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
