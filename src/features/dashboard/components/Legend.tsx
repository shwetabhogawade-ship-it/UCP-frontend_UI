import React from 'react';

export interface LegendItem {
  l: string;
  v?: React.ReactNode;
  c: string;
  /** Optional percentage suffix, e.g. "(45%)" */
  p?: string;
}

interface LegendProps {
  items: LegendItem[];
}

/** Horizontal legend row, anchored to the bottom of a card via `.d-card > .legend`. */
export const Legend: React.FC<LegendProps> = ({ items }) => (
  <div className="legend">
    {items.map((i) => (
      <div className="leg" key={i.l}>
        <span className="leg-dot" style={{ background: i.c }} />
        <span>{i.l}</span>
        {i.v !== undefined && i.v !== '' && <b>{i.v}</b>}
        {i.p && <span className="pct">{i.p}</span>}
      </div>
    ))}
  </div>
);

export default Legend;
