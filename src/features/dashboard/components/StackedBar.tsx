import React from 'react';

export interface StackedSegment {
  l: string;
  v: number;
  c: string;
}

interface StackedBarProps {
  segments: StackedSegment[];
  height?: number;
  /** Show on-hover tooltip with label, value and percentage */
  withTooltip?: boolean;
}

/**
 * Horizontal stacked bar — used for revenue splits, payment splits,
 * shipment pipeline, delay severity, etc.
 */
export const StackedBar: React.FC<StackedBarProps> = ({
  segments,
  height = 32,
  withTooltip = true,
}) => {
  const total = segments.reduce((acc, s) => acc + s.v, 0);
  if (total <= 0) return null;

  return (
    <div className="stacked" style={{ height }}>
      {segments.map((s) => {
        const pct = (s.v / total) * 100;
        return (
          <div key={s.l} style={{ width: `${pct}%`, background: s.c }}>
            {withTooltip && (
              <span className="stk-tip">
                {s.l}: {s.v.toLocaleString()} ({Math.round(pct * 10) / 10}%)
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StackedBar;
