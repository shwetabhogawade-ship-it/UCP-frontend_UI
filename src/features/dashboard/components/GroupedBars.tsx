import React from 'react';

export interface GroupedBarSlot {
  label: string;
  /** Bars in display order, each pre-sized in px height */
  bars: { color: string; heightPx: number; width?: number }[];
}

interface GroupedBarsProps {
  slots: GroupedBarSlot[];
}

/**
 * Vertical grouped bar chart. Heights are pre-computed by the caller
 * (mirrors the source HTML which derives `height = value / max * 100`).
 */
export const GroupedBars: React.FC<GroupedBarsProps> = ({ slots }) => (
  <div className="gbar-chart">
    {slots.map((slot) => (
      <div key={slot.label} className="gbar-slot">
        <div className="gbar-group">
          {slot.bars.map((b, i) => (
            <div
              key={i}
              className="gbar-col"
              style={{
                height: `${b.heightPx}px`,
                background: b.color,
                width: b.width ?? 16,
              }}
            />
          ))}
        </div>
        <div className="gbar-lbl">{slot.label}</div>
      </div>
    ))}
  </div>
);

export default GroupedBars;
