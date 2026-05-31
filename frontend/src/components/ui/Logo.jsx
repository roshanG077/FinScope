import React from 'react';

export const LogoIcon = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Gradient for magnifying ring */}
      <linearGradient id="finRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
      {/* Gradient for bars */}
      <linearGradient id="finBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
      {/* Mask for creating transparent cutouts */}
      <mask id="cutoutMask">
        <rect x="0" y="0" width="100" height="100" fill="white" />
        {/* Line Chart Outer Stroke cutout */}
        <path d="M14 62 L28 52 L42 56 L56 36 L76 22" stroke="black" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots Outer Stroke cutout */}
        <circle cx="14" cy="62" r="5" fill="black" />
        <circle cx="28" cy="52" r="5" fill="black" />
        <circle cx="42" cy="56" r="5" fill="black" />
        <circle cx="56" cy="36" r="5" fill="black" />
        <circle cx="76" cy="22" r="5" fill="black" />
      </mask>
    </defs>
    
    {/* Base elements with mask applied */}
    <g mask="url(#cutoutMask)">
      {/* Magnifying Glass Ring */}
      <circle cx="44" cy="44" r="30" stroke="url(#finRingGrad)" strokeWidth="8" className="dark:stroke-blue-500" />
      {/* Handle */}
      <path d="M64 64 L82 82" stroke="#172554" strokeWidth="14" strokeLinecap="round" className="dark:stroke-blue-400" />
      {/* Bars */}
      <rect x="24" y="46" width="8" height="14" rx="2" fill="url(#finBarGrad)" className="dark:fill-blue-400" />
      <rect x="38" y="32" width="8" height="28" rx="2" fill="url(#finBarGrad)" className="dark:fill-blue-400" />
      <rect x="52" y="16" width="8" height="44" rx="2" fill="url(#finBarGrad)" className="dark:fill-blue-400" />
    </g>

    {/* Line Chart Inner Line */}
    <path d="M14 62 L28 52 L42 56 L56 36 L76 22" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-blue-300" />
    
    {/* Dots Inner Fill */}
    <circle cx="14" cy="62" r="2.5" fill="#2563eb" className="dark:fill-blue-300" />
    <circle cx="28" cy="52" r="2.5" fill="#2563eb" className="dark:fill-blue-300" />
    <circle cx="42" cy="56" r="2.5" fill="#2563eb" className="dark:fill-blue-300" />
    <circle cx="56" cy="36" r="2.5" fill="#2563eb" className="dark:fill-blue-300" />
    <circle cx="76" cy="22" r="2.5" fill="#2563eb" className="dark:fill-blue-300" />
  </svg>
);

export const LogoFull = ({ className = 'h-8' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <LogoIcon className="h-full aspect-square shrink-0" />
    <div className="flex flex-col justify-center select-none">
      <span className="text-xl font-bold leading-none tracking-tight">
        <span className="text-slate-900 dark:text-white">Fin</span>
        <span className="text-blue-600 dark:text-blue-400">Scope</span>
      </span>
      <span className="text-[0.55rem] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase leading-none mt-1">
        Expense Detector
      </span>
    </div>
  </div>
);
