import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Generic placeholder rendered for nav modules that aren't built yet.
 * Reads the page title from `location.state.title` when provided, otherwise
 * derives it from the last URL segment.
 */
export const ComingSoonPage: React.FC<{ title?: string }> = ({ title }) => {
  const { pathname } = useLocation();
  const fallback = pathname.split('/').filter(Boolean).pop() ?? 'Module';
  const heading = title ?? fallback.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="page">
      <div className="page-placeholder">
        <div className="ph-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M8 12h8M8 16h5" strokeLinecap="round" />
            <circle cx="12" cy="8" r="2" />
          </svg>
        </div>
        <h2>{heading}</h2>
        <p>
          This module is part of the XpressBees Seller Platform and will be available soon.
          Use <strong>⌘ \</strong> to toggle the side navigation.
        </p>
      </div>
    </div>
  );
};

export default ComingSoonPage;
