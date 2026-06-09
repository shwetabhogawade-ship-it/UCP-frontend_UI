import React from 'react';

export type BadgeTone = 'green' | 'red' | 'amber' | 'blue' | 'gray' | 'orange';

interface BadgeProps {
  tone: BadgeTone;
  children: React.ReactNode;
}

/* Pill badge with semantic color tokens — matches `.d-badge` in dashboard.css */
export const Badge: React.FC<BadgeProps> = ({ tone, children }) => (
  <span className={`d-badge bg-${tone}`}>{children}</span>
);

export default Badge;
