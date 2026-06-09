import React from 'react';
import Bar from './Bar';

export interface FunnelDualColumn {
  hdr: string;
  responded: number;
  positive: number;
  delivered: number;
  /** Optional channel-specific palette */
  colors?: { responded: string; positive: string; delivered: string };
}

interface FunnelDualProps {
  columns: [FunnelDualColumn, FunnelDualColumn];
  /** Common scale ceiling so both columns can be visually compared */
  scale?: number;
}

const DEFAULT_COLORS = {
  responded: 'var(--c-resp)',
  positive:  'var(--am)',
  delivered: 'var(--c-ontime)',
};

/** Side-by-side 3-step funnel (Responded → Positive → Delivered). */
export const FunnelDual: React.FC<FunnelDualProps> = ({ columns, scale }) => {
  const max = scale ?? Math.max(
    columns[0].responded, columns[1].responded, 1,
  );

  return (
    <div className="funnel-dual">
      {columns.map((c) => {
        const palette = { ...DEFAULT_COLORS, ...(c.colors ?? {}) };
        return (
          <div className="f-col" key={c.hdr}>
            <div className="f-hdr">{c.hdr}</div>
            <div className="funnel-step">
              <div className="funnel-n">{c.responded}</div>
              <div className="funnel-info">
                <div className="f-lbl">Responded</div>
                <div className="f-bar"><Bar value={c.responded} max={max} color={palette.responded} large /></div>
              </div>
            </div>
            <div className="funnel-step">
              <div className="funnel-n" style={{ color: 'var(--amber)' }}>{c.positive}</div>
              <div className="funnel-info">
                <div className="f-lbl">Positive Action</div>
                <div className="f-bar"><Bar value={c.positive} max={max} color={palette.positive} large /></div>
              </div>
            </div>
            <div className="funnel-step">
              <div className="funnel-n" style={{ color: 'var(--green)' }}>{c.delivered}</div>
              <div className="funnel-info">
                <div className="f-lbl">Delivered</div>
                <div className="f-bar"><Bar value={c.delivered} max={max} color={palette.delivered} large /></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FunnelDual;
