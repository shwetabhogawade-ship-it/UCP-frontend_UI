import React, { useEffect, useState } from 'react';
import {
  AGE_STATUSES,
  CHANNELS,
  DATE_RANGE_OPTIONS,
  DEFAULT_TAGS,
  PAYMENT_MODES,
  PICKUP_LOCATIONS,
} from '../data/ordersData';
import {
  ALL_SHIPMENT_STATUSES,
  TRANSPORT_MODES,
} from '../data/shipmentsData';
import type { FilterOption } from '../types';
import type { OrdersFilterState } from './OrdersFilterBar';

interface MoreFiltersDrawerProps {
  state: OrdersFilterState;
  onClose: () => void;
  onApply: (next: OrdersFilterState) => void;
  onReset: () => void;
  /** Custom tag pool — falls back to DEFAULT_TAGS when omitted. */
  availableTags?: string[];
}

/** Generic pill multi-toggle used several times in the drawer body. */
const PillMulti: React.FC<{
  options: FilterOption[];
  values: string[];
  onToggle: (id: string) => void;
}> = ({ options, values, onToggle }) => (
  <div className="ord-df-options">
    {options.map((o) => (
      <button
        key={o.id}
        type="button"
        className={`ord-df-opt ${values.includes(o.id) ? 'on' : ''}`}
        onClick={() => onToggle(o.id)}
      >
        {o.label}
      </button>
    ))}
  </div>
);

/**
 * Right-side filter drawer with the full superset of filters: all the inline
 * chip filters plus Tags and a multi-order-id text search. Local edits commit
 * only when "Apply" is pressed — cancelling preserves the parent state.
 */
export const MoreFiltersDrawer: React.FC<MoreFiltersDrawerProps> = ({
  state,
  onClose,
  onApply,
  onReset,
  availableTags = DEFAULT_TAGS,
}) => {
  const [local, setLocal] = useState<OrdersFilterState>(state);

  useEffect(() => setLocal(state), [state]);

  const toggle =
    <K extends 'pickupLocations' | 'channels' | 'tags' | 'shipmentStatuses'>(key: K) =>
    (id: string) => {
      const arr = local[key] as string[];
      const next = arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id];
      setLocal({ ...local, [key]: next });
    };

  const tagOptions: FilterOption[] = availableTags.map((t) => ({ id: t, label: t }));

  return (
    <div className="ord-drawer-ov" role="dialog" aria-modal="true" aria-label="All filters">
      <div className="ord-drawer">
        <div className="ord-drawer-hdr">
          <div>
            <div className="ord-drawer-title">All Filters</div>
            <div className="ord-drawer-sub">Refine the order list with the complete filter set</div>
          </div>
          <button type="button" className="ord-modal-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="ord-drawer-body">
          <section className="ord-df-sec">
            <div className="ord-df-sec-lbl">Date range</div>
            <PillMulti
              options={DATE_RANGE_OPTIONS}
              values={[local.dateRange]}
              onToggle={(id) => setLocal({ ...local, dateRange: id })}
            />
          </section>

          <section className="ord-df-sec">
            <div className="ord-df-sec-lbl">Pickup locations</div>
            <PillMulti
              options={PICKUP_LOCATIONS}
              values={local.pickupLocations}
              onToggle={toggle('pickupLocations')}
            />
          </section>

          <section className="ord-df-sec">
            <div className="ord-df-sec-lbl">Payment mode</div>
            <PillMulti
              options={PAYMENT_MODES}
              values={local.paymentMode ? [local.paymentMode] : []}
              onToggle={(id) =>
                setLocal({ ...local, paymentMode: local.paymentMode === id ? null : id })
              }
            />
          </section>

          <section className="ord-df-sec">
            <div className="ord-df-sec-lbl">Channel</div>
            <PillMulti
              options={CHANNELS}
              values={local.channels}
              onToggle={toggle('channels')}
            />
          </section>

          <section className="ord-df-sec">
            <div className="ord-df-sec-lbl">Order status</div>
            <PillMulti
              options={AGE_STATUSES}
              values={local.status ? [local.status] : []}
              onToggle={(id) =>
                setLocal({ ...local, status: local.status === id ? null : id })
              }
            />
          </section>

          <section className="ord-df-sec">
            <div className="ord-df-sec-lbl">Transport mode</div>
            <PillMulti
              options={TRANSPORT_MODES}
              values={local.transportMode ? [local.transportMode] : []}
              onToggle={(id) =>
                setLocal({ ...local, transportMode: local.transportMode === id ? null : id })
              }
            />
          </section>

          <section className="ord-df-sec">
            <div className="ord-df-sec-lbl">Shipment status</div>
            <PillMulti
              options={ALL_SHIPMENT_STATUSES}
              values={local.shipmentStatuses}
              onToggle={toggle('shipmentStatuses')}
            />
          </section>

          <section className="ord-df-sec">
            <div className="ord-df-sec-lbl">Tags</div>
            <PillMulti
              options={tagOptions}
              values={local.tags}
              onToggle={toggle('tags')}
            />
          </section>

          <section className="ord-df-sec">
            <div className="ord-df-sec-lbl">Multi order ID search</div>
            <textarea
              className="ord-df-textarea"
              placeholder="Paste order IDs separated by comma or newline..."
              value={local.orderIdSearch}
              onChange={(e) => setLocal({ ...local, orderIdSearch: e.target.value })}
            />
          </section>
        </div>

        <div className="ord-drawer-ft">
          <button
            type="button"
            className="ord-cta ord-cta-s"
            onClick={() => {
              onReset();
              onClose();
            }}
          >
            Reset all
          </button>
          <button
            type="button"
            className="ord-cta ord-cta-p"
            onClick={() => {
              onApply(local);
              onClose();
            }}
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoreFiltersDrawer;
