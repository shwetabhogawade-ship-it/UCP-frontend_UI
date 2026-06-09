import React from 'react';
import {
  NDR_ATTEMPT_BUCKETS,
  NDR_CHANNELS,
  NDR_DATE_RANGE_OPTIONS,
  NDR_PAYMENT_MODES,
  NDR_REASONS,
  NDR_SHIPMENT_TYPES,
} from '../data/ndrData';
import type { NdrFilterState } from './NdrFilterBar';

interface NdrActiveFiltersProps {
  state: NdrFilterState;
  onChange: (next: NdrFilterState) => void;
  onClearAll: () => void;
}

interface Chip {
  key: keyof NdrFilterState;
  label: string;
}

/**
 * Compact strip of pill-shaped chips representing every active filter.
 * Each chip removes its own filter on click; "Clear all" wipes them all.
 * Returns `null` when no filter is active so the row collapses cleanly.
 */
export const NdrActiveFilters: React.FC<NdrActiveFiltersProps> = ({
  state,
  onChange,
  onClearAll,
}) => {
  const chips: Chip[] = [];

  if (state.dateRange) {
    const opt = NDR_DATE_RANGE_OPTIONS.find((o) => o.id === state.dateRange);
    chips.push({ key: 'dateRange', label: opt?.label ?? state.dateRange });
  }
  if (state.reason) {
    const opt = NDR_REASONS.find((o) => o.id === state.reason);
    chips.push({ key: 'reason', label: opt?.label ?? state.reason });
  }
  if (state.attempts) {
    const opt = NDR_ATTEMPT_BUCKETS.find((o) => o.id === state.attempts);
    chips.push({ key: 'attempts', label: opt?.label ?? state.attempts });
  }
  if (state.shipmentType) {
    const opt = NDR_SHIPMENT_TYPES.find((o) => o.id === state.shipmentType);
    chips.push({ key: 'shipmentType', label: opt?.label ?? state.shipmentType });
  }
  if (state.paymentMode) {
    const opt = NDR_PAYMENT_MODES.find((o) => o.id === state.paymentMode);
    chips.push({ key: 'paymentMode', label: opt?.label ?? state.paymentMode });
  }
  if (state.channel) {
    const opt = NDR_CHANNELS.find((o) => o.id === state.channel);
    chips.push({ key: 'channel', label: opt?.label ?? state.channel });
  }

  if (chips.length === 0) return null;

  const remove = (key: keyof NdrFilterState) => {
    onChange({ ...state, [key]: null } as NdrFilterState);
  };

  return (
    <div className="ndr-af-row" role="region" aria-label="Active filters">
      {chips.map((c) => (
        <span key={c.key} className="ndr-af-chip">
          {c.label}
          <button
            type="button"
            onClick={() => remove(c.key)}
            aria-label={`Remove filter: ${c.label}`}
          >
            ✕
          </button>
        </span>
      ))}
      <button type="button" className="ndr-af-clr" onClick={onClearAll}>
        Clear all
      </button>
    </div>
  );
};

export default NdrActiveFilters;
