import React from 'react';
import type { CellTone } from '../data/dashboardData';

export interface HeatmapRow {
  label: string;
  cells: (number | string)[];
  tones: CellTone[];
}

interface HeatmapProps {
  /** Column headings (excluding the leading row-label column) */
  columns: string[];
  rows: HeatmapRow[];
}

const TONE_CLASS: Record<CellTone, string> = {
  good:    'cell-good',
  warn:    'cell-warn',
  bad:     'cell-bad',
  neutral: 'cell-neutral',
};

/** Weekly / day-of-week heatmap. Used by NDR attempt coverage + Seller/Buyer response. */
export const Heatmap: React.FC<HeatmapProps> = ({ columns, rows }) => (
  <table className="ht">
    <thead>
      <tr>
        <th />
        {columns.map((c) => (
          <th key={c}>{c}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((r) => (
        <tr key={r.label}>
          <td>{r.label}</td>
          {r.cells.map((cell, i) => (
            <td key={i} className={TONE_CLASS[r.tones[i] ?? 'neutral']}>
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Heatmap;
