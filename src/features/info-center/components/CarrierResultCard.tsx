import React, { useState } from 'react';
import type { CarrierBreakdown } from '../types';
import { rupees } from '../data/rateCalculatorData';

const ChevronIcon = (
  <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 1l4 4 4-4" strokeLinecap="round" />
  </svg>
);

interface BreakdownRow {
  label: string;
  value: string;
}

export interface CarrierResultCardProps {
  /** Header icon (SVG). */
  icon: React.ReactNode;
  /** Background tint for the icon chip (`surface` orange, `express` green). */
  variant: 'surface' | 'express';
  /** Display name shown in bold. */
  name: string;
  /** Computed totals (price + breakdown). */
  data: CarrierBreakdown;
  /** Label shown above the base-fare row (e.g. "Base freight", "Base RTO freight"). */
  baseLabel: string;
  /** Caption under the price (e.g. "incl. GST & all charges"). */
  priceSub: string;
  /** Hide COD row when the panel is RTO. */
  showCod?: boolean;
}

/**
 * One carrier row inside the result panel (Surface / Air Express / RTO …).
 * Owns its own "View breakdown" collapse state — siblings stay independent.
 */
export const CarrierResultCard: React.FC<CarrierResultCardProps> = ({
  icon,
  variant,
  name,
  data,
  baseLabel,
  priceSub,
  showCod = true,
}) => {
  const [open, setOpen] = useState(false);

  const rows: BreakdownRow[] = [
    { label: baseLabel, value: rupees(data.base) },
    ...(showCod
      ? [{ label: 'COD charge', value: data.isCod ? rupees(data.cod) : '₹0 (Prepaid)' }]
      : []),
    { label: 'Fuel surcharge', value: data.fuel },
    { label: 'GST (18%)', value: `${rupees(data.gst)} (incl.)` },
    { label: 'Total', value: rupees(data.total) },
  ];

  return (
    <div className="ic-carrier-card">
      <div className="ic-cc-top">
        <div className={`ic-cc-icon ${variant}`}>{icon}</div>
        <div className="ic-cc-name">{name}</div>
        <div>
          <div className="ic-cc-price">{rupees(data.total)}</div>
          <div className="ic-cc-price-sub">{priceSub}</div>
        </div>
      </div>
      <button
        type="button"
        className={`ic-cc-breakdown${open ? ' open' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        aria-expanded={open}
      >
        View breakdown {ChevronIcon}
      </button>
      {open && (
        <div className="ic-breakdown-detail">
          {rows.map((row) => (
            <div key={row.label} className="ic-bd-row">
              <span>{row.label}</span>
              <span className="val">{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarrierResultCard;
