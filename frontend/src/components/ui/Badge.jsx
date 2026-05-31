import React from 'react';

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span className={`badge-ui badge-variant-${variant} ${className}`}>
      {children}
    </span>
  );
}
