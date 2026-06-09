import React from 'react';

interface CardProps {
  title?: React.ReactNode;
  sub?: React.ReactNode;
  /** Optional element rendered top-right of the header (e.g. badge, action button) */
  action?: React.ReactNode;
  /** When provided, replaces the default header layout entirely */
  header?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * Dashboard card shell. Mirrors `.d-card` and the common title/sub pattern
 * used by every widget on the page. `header` escape hatch is for cards that
 * need a non-standard top row (e.g. inline CTAs alongside the title).
 */
export const Card: React.FC<CardProps> = ({ title, sub, action, header, className = '', children }) => (
  <div className={`d-card ${className}`}>
    {header ?? (
      (title || sub || action) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: action ? 'center' : 'flex-start',
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div>
            {title && <div className="w-title">{title}</div>}
            {sub && <div className="w-sub">{sub}</div>}
          </div>
          {action}
        </div>
      )
    )}
    {children}
  </div>
);

export default Card;
