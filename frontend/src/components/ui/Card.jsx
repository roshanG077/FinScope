import React from 'react';

export default function Card({ children, className = '', glow = '' }) {
  const glowClass = glow ? `card-glow-${glow}` : '';
  return (
    <div className={`card-glass ${glowClass} ${className}`}>
      {children}
    </div>
  );
}
