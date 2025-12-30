import React from 'react'

export const TechDecorationTopLeft = () => (
  <svg className="absolute -top-px -left-px w-16 h-16 pointer-events-none" viewBox="0 0 64 64" fill="none">
    <path d="M0 64V16L16 0H64" stroke="#33ABB9" strokeWidth="1.5" strokeOpacity="1" />
    <path d="M0 16L16 0" fill="#33ABB9" fillOpacity="0.2" />
    <circle cx="16" cy="16" r="2" fill="#33ABB9" />
    <path d="M6 16H26" stroke="#33ABB9" strokeWidth="1" strokeOpacity="0.5" />
    <path d="M16 6V26" stroke="#33ABB9" strokeWidth="1" strokeOpacity="0.5" />
  </svg>
);

export const TechDecorationBottomRight = () => (
  <svg className="absolute -bottom-px -right-px w-20 h-20 pointer-events-none" viewBox="0 0 80 80" fill="none">
    <path d="M80 0V48L64 64H48L32 80H0" stroke="#33ABB9" strokeWidth="1.5" strokeOpacity="1" />
    <path d="M64 64L32 80V64H64Z" fill="#33ABB9" fillOpacity="0.1" />
    <g transform="translate(60, 60)">
      <circle cx="0" cy="0" r="12" stroke="#33ABB9" strokeWidth="1" strokeOpacity="0.8" strokeDasharray="10 5" />
      <circle cx="0" cy="0" r="6" stroke="#33ABB9" strokeWidth="1" fill="#33ABB9" fillOpacity="0.2" />
      <circle cx="0" cy="0" r="2" fill="#ffffff" />
    </g>
  </svg>
);

export const TechDecorationTopRight = () => (
  <svg className="absolute -top-px -right-px w-12 h-12 pointer-events-none" viewBox="0 0 48 48" fill="none">
    <path d="M0 0H32L48 16V32" stroke="#33ABB9" strokeWidth="1.5" />
    <rect x="42" y="6" width="3" height="3" fill="#33ABB9" />
    <rect x="38" y="6" width="3" height="3" fill="#33ABB9" fillOpacity="0.5" />
  </svg>
);

export const TechDecorationBottomLeft = () => (
  <svg className="absolute -bottom-px -left-px w-12 h-12 pointer-events-none" viewBox="0 0 48 48" fill="none">
    <path d="M0 32V48H16" stroke="#33ABB9" strokeWidth="1.5" />
    <path d="M0 32L16 48" stroke="#33ABB9" strokeWidth="0.5" strokeOpacity="0.3" />
  </svg>
);