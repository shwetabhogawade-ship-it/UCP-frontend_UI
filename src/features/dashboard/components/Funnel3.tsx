import React from 'react';

export interface Funnel3Column {
  hdr: string;
  total: number;
  pending: number;
  delivered: number;
}

interface Funnel3Props {
  columns: Funnel3Column[];
}

/** 3-column attempt funnel — used for the NDR attempt progression widget. */
export const Funnel3: React.FC<Funnel3Props> = ({ columns }) => (
  <div className="funnel-3">
    {columns.map((c) => (
      <div className="f3-col" key={c.hdr}>
        <div className="f3-hdr">{c.hdr}</div>
        <div className="f3-row">
          <div className="f3-n">{c.total}</div>
          <div className="f3-lbl">Total</div>
        </div>
        <div className="f3-row">
          <div className="f3-n" style={{ color: 'var(--amber)' }}>{c.pending}</div>
          <div className="f3-lbl">Pending</div>
        </div>
        <div className="f3-row">
          <div className="f3-n" style={{ color: 'var(--green)' }}>{c.delivered}</div>
          <div className="f3-lbl">Delivered</div>
        </div>
      </div>
    ))}
  </div>
);

export default Funnel3;
