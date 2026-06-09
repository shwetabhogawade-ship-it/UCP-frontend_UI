import React from 'react';
import Bar from './Bar';

interface RankedRowProps {
  name: string;
  value: number;
  max: number;
  color: string;
  /** Right-aligned meta cluster (free-form: orders, revenue, percentage etc.) */
  meta: React.ReactNode;
  /** Optional small pill under the name (e.g. "Top") */
  topBadge?: React.ReactNode;
}

/**
 * Single ranked row: name on the left, bar in the middle, metric(s) on the right.
 * Used by category/product/location/customer/RTO/NDR-reason widgets.
 */
export const RankedRow: React.FC<RankedRowProps> = ({ name, value, max, color, meta, topBadge }) => (
  <div className="ranked-row">
    <div className="r-name">
      <span title={name}>{name}</span>
      {topBadge && <div className="r-badge">{topBadge}</div>}
    </div>
    <div className="r-bar">
      <Bar value={value} max={max} color={color} large />
    </div>
    <div className="r-meta">{meta}</div>
  </div>
);

export default RankedRow;
