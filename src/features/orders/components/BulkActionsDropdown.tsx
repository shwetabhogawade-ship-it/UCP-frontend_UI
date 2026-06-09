import React, { useEffect, useRef, useState } from 'react';
import type { BulkAction } from '../data/ordersData';

interface BulkActionsDropdownProps {
  actions: BulkAction[];
  /** True when at least one row is selected.
   *  The dropdown is always interactable; this flag is forwarded to
   *  the caller via `onPick` so it can short-circuit no-op clicks
   *  with a friendly toast. */
  enabled: boolean;
  onPick: (action: BulkAction) => void;
}

/**
 * "Select Bulk Action" dropdown. Lives in the right-hand actions
 * group on the Orders page and is always presented as an active
 * dropdown — selection gating is done by the caller via `onPick`.
 */
export const BulkActionsDropdown: React.FC<BulkActionsDropdownProps> = ({
  actions,
  enabled,
  onPick,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="ord-bulk-sel">
      <button
        type="button"
        className={`ord-bulk-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={
          enabled
            ? 'Apply a bulk action to the selected orders'
            : 'Select one or more orders, then pick a bulk action'
        }
      >
        <span>Select Bulk Action</span>
        <span className="arr">▾</span>
      </button>

      {open && (
        <div className="ord-dd right" style={{ minWidth: 240 }} role="listbox">
          <div className="ord-dd-body">
            {actions.map((a) => (
              <div
                key={a.id}
                className="ord-dd-i"
                role="option"
                aria-selected="false"
                onClick={() => {
                  onPick(a);
                  setOpen(false);
                }}
              >
                {a.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionsDropdown;
