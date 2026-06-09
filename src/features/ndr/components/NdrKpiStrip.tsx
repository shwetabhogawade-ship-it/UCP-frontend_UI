import React from 'react';
import type { NdrKpiBucket } from '../types';

interface NdrKpiStripProps {
  counts: Record<NdrKpiBucket, number>;
  active: NdrKpiBucket;
  onSelect: (bucket: NdrKpiBucket) => void;
}

/* Card icon glyphs (sized to the .ord-kc-ico 30×30 chip) */
const TrendIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 14l4-4 3 3 4-5 3 3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const TriangleAlertIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 2L2 13h12L8 2z" strokeLinejoin="round" />
    <path d="M8 6.5v3M8 11h.01" strokeLinecap="round" />
  </svg>
);
const SellerIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="6" r="3.5" />
    <path d="M2 15c0-3.3 2.7-5 6-5s6 1.7 6 5" strokeLinecap="round" />
  </svg>
);
const CheckCircleIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6" />
    <path d="M5.5 8l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface CardSpec {
  id: NdrKpiBucket;
  label: string;
  sub: string;
  /** Tag rendered under the count */
  tag: React.ReactNode;
  /** KPI accent → drives the active ring + icon-chip tone */
  accent: 'orange' | 'red' | 'amber' | 'grey';
  iconBg: string;
  iconStroke: string;
  icon: React.ReactNode;
  /** Override count text color when set */
  countColor?: string;
  /** Accent bar color (left edge) */
  barColor: string;
}

const ACCENT_RING: Record<CardSpec['accent'], string> = {
  orange: 'ndr-acc-orange',
  red:    'ndr-acc-red',
  amber:  'ndr-acc-amber',
  grey:   'ndr-acc-grey',
};

/**
 * NDR KPI summary — 4 clickable priority cards (mirrors the
 * `ui-source/screens/ndr-v1.html` `.kc` cards). Clicking a card
 * filters the grid by that priority bucket; clicking the active
 * card again returns to "All NDR".
 */
export const NdrKpiStrip: React.FC<NdrKpiStripProps> = ({ counts, active, onSelect }) => {
  const cards: CardSpec[] = [
    {
      id: 'all',
      label: 'All NDR',
      sub: 'Total failed delivery attempts',
      tag: (
        <span className="ndr-kc-tag ink">
          <svg viewBox="0 0 8 8" fill="currentColor" style={{ width: 7, height: 7 }}>
            <circle cx="4" cy="4" r="3.5" />
          </svg>
          All categories shown
        </span>
      ),
      accent: 'orange',
      iconBg: 'var(--s3)',
      iconStroke: 'var(--ink2)',
      icon: TrendIcon,
      barColor: 'var(--orange)',
    },
    {
      id: 'critical',
      label: 'Critical — Action Required',
      sub: 'Wrong address · Refused · Payment dispute',
      tag: (
        <span className="ndr-kc-tag red">
          <span className="ndr-kc-dot red ndr-blink" />
          Needs immediate attention
        </span>
      ),
      accent: 'red',
      iconBg: 'var(--rl)',
      iconStroke: 'var(--red)',
      icon: TriangleAlertIcon,
      countColor: 'var(--red)',
      barColor: 'var(--red)',
    },
    {
      id: 'seller',
      label: 'Seller Action Required',
      sub: 'Unavailable · Office closed · Wrong time',
      tag: (
        <span className="ndr-kc-tag amber">
          <span className="ndr-kc-dot amber" />
          Resolve within 24 hours
        </span>
      ),
      accent: 'amber',
      iconBg: 'var(--al)',
      iconStroke: 'var(--amber)',
      icon: SellerIcon,
      countColor: 'var(--amber)',
      barColor: 'var(--amber)',
    },
    {
      id: 'none',
      label: 'No Action Required',
      sub: 'Auto re-attempt · IVR verified · Rescheduled',
      tag: (
        <span className="ndr-kc-tag grey">
          <svg viewBox="0 0 8 8" fill="currentColor" style={{ width: 7, height: 7 }}>
            <circle cx="4" cy="4" r="3.5" />
          </svg>
          Carrier handling
        </span>
      ),
      accent: 'grey',
      iconBg: 'var(--gray-l, #EEECE9)',
      iconStroke: 'var(--gray, #6B6A62)',
      icon: CheckCircleIcon,
      countColor: 'var(--gray, #6B6A62)',
      barColor: 'var(--gray, #6B6A62)',
    },
  ];

  return (
    <div className="ord-kc-row" role="group" aria-label="NDR summary">
      {cards.map((c) => {
        const isOn = active === c.id;
        return (
          <button
            key={c.id}
            type="button"
            className={`ord-kc ${ACCENT_RING[c.accent]} ${isOn ? 'on' : ''}`}
            onClick={() => onSelect(c.id)}
            aria-pressed={isOn}
          >
            <div className="ord-kc-bar" style={{ background: c.barColor }} />
            <div className="ord-kc-top">
              <div className="ord-kc-lbl">{c.label}</div>
              <div className="ord-kc-ico" style={{ background: c.iconBg }}>
                <svg viewBox="0 0 16 16" fill="none" stroke={c.iconStroke} strokeWidth="1.5">
                  {c.icon}
                </svg>
              </div>
            </div>
            <div className="ord-kc-n" style={c.countColor ? { color: c.countColor } : undefined}>
              {counts[c.id]}
            </div>
            <div className="ord-kc-sub">{c.sub}</div>
            {c.tag}
          </button>
        );
      })}
    </div>
  );
};

export default NdrKpiStrip;
