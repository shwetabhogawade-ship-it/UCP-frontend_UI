import React from 'react';

interface BarProps {
  value: number;
  max: number;
  color: string;
  /** Larger height variant for funnel/secondary use */
  large?: boolean;
}

/** Single horizontal bar (`.barx` / `.barx-fill`). */
export const Bar: React.FC<BarProps> = ({ value, max, color, large }) => {
  const pct = max <= 0 ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div className={`barx${large ? ' lg' : ''}`}>
      <div className="barx-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
};

export default Bar;
