import React from 'react';

export const Sidebar: React.FC = () => {
  return (
    <nav className="sb">
      <div className="sb-logo">
        <svg viewBox="0 0 20 20">
          <path d="M3 10L10 3l7 7M5 8.5v9h4v-5h2v5h4v-9" />
        </svg>
      </div>
      <div className="sb-i">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="7" height="7" rx="1.5" />
          <rect x="11" y="2" width="7" height="7" rx="1.5" />
          <rect x="2" y="11" width="7" height="7" rx="1.5" />
          <rect x="11" y="11" width="7" height="7" rx="1.5" />
        </svg>
      </div>
      <div className="sb-i">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4h12M4 8h8M4 12h10M4 16h6" strokeLinecap="round" />
        </svg>
      </div>
      <div className="sb-i">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 15l4-4 3 3 4-5 3 3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 18h14" strokeLinecap="round" />
        </svg>
      </div>
      <div className="sb-sep"></div>
      <div className="sb-i">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="16" height="14" rx="2" />
          <path d="M2 7h16" strokeLinecap="round" />
        </svg>
      </div>
      <div className="sb-i">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 2L2 7v6l8 5 8-5V7L10 2z" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="sb-i">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="10" cy="10" r="7" />
          <path d="M7 9a3 3 0 015.5 1.5c0 1.5-2 2-2 3M10 15.5h.01" strokeLinecap="round" />
        </svg>
      </div>
      <div className="sb-f"></div>
      <div className="sb-sep"></div>
      <div className="sb-i on">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="14" height="4" rx="1.5" />
          <rect x="3" y="9" width="14" height="4" rx="1.5" />
          <rect x="3" y="15" width="8" height="2" rx="1" />
        </svg>
      </div>
      <div className="sb-i">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="10" cy="10" r="3" />
          <path d="M10 1v2M10 17v2M1 10h2M17 10h2" strokeLinecap="round" />
        </svg>
      </div>
    </nav>
  );
};
export default Sidebar;
