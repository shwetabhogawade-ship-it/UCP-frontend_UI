import React from 'react';

interface InsightProps {
  children: React.ReactNode;
}

/** Inline insight callout — bottom-of-card explanation block. */
export const Insight: React.FC<InsightProps> = ({ children }) => (
  <div className="insight">{children}</div>
);

export default Insight;
