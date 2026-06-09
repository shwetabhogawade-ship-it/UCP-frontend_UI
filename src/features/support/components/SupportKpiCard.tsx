import React from 'react';

interface SupportKpiCardProps {
  label: string;
  value: number | string;
  sub?: string;
  /** Accent colour token (e.g. var(--orange), var(--amber)) */
  accent: string;
  /** Soft background for the icon chip */
  iconBg: string;
  /** Stroke for the icon SVG */
  iconStroke: string;
  /** SVG `<path/>` etc. children rendered inside the icon */
  icon: React.ReactNode;
}

/**
 * Compact KPI tile used by the Support overview panel.
 * Mirrors the `.kc` card in `support_prototype_v7b.html` while reusing the
 * same surface/border tokens as the dashboard's `.kpi` so the visual
 * language stays consistent.
 */
export const SupportKpiCard: React.FC<SupportKpiCardProps> = ({
  label,
  value,
  sub,
  accent,
  iconBg,
  iconStroke,
  icon,
}) => (
  <div className="skc">
    <div className="skc-bar" style={{ background: accent }} />
    <div className="skc-top">
      <div className="skc-lbl">{label}</div>
      <div className="skc-ico" style={{ background: iconBg }}>
        <svg viewBox="0 0 16 16" fill="none" stroke={iconStroke} strokeWidth="1.5">
          {icon}
        </svg>
      </div>
    </div>
    <div className="skc-n">{value}</div>
    {sub && <div className="skc-sub">{sub}</div>}
  </div>
);

export default SupportKpiCard;
