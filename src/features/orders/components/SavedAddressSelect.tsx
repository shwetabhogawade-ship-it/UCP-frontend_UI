import React, { useEffect, useRef, useState } from 'react';

export interface SavedAddressOption {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  isVerified?: boolean;
  /** Optional subtitle, shown small under the name (e.g. "Primary"). */
  hint?: string;
}

interface SavedAddressSelectProps {
  /** Currently selected option id (null when nothing chosen yet). */
  value: string | null;
  options: SavedAddressOption[];
  placeholder: string;
  /** Label for the "+ Add New" footer link. */
  addNewLabel: string;
  onChange: (id: string) => void;
  onAddNew: () => void;
}

/**
 * Dropdown trigger used by the Pickup + Customer cards on the New Forward
 * Order page. Displays a list of saved addresses with name + truncated
 * address + verified badge, and exposes an "+ Add New" footer link that
 * routes to the shared side drawer.
 *
 * Visual recipe extends the existing `.cdd*` (support) primitives so it
 * inherits the same focus/hover/active styling as every other dropdown
 * in the codebase. We add a thin `.ord-nf-addrlist` skin for the richer
 * two-line option layout.
 */
export const SavedAddressSelect: React.FC<SavedAddressSelectProps> = ({
  value,
  options,
  placeholder,
  addNewLabel,
  onChange,
  onAddNew,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const selected = options.find((o) => o.id === value) ?? null;
  const filtered = query
    ? options.filter((o) =>
        (o.name + ' ' + o.address + ' ' + o.phone).toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  return (
    <div className="cdd" ref={ref}>
      <button
        type="button"
        className={`cdd-btn ${selected ? '' : 'placeholder'}`}
        onClick={() => setOpen((p) => !p)}
      >
        {selected ? `${selected.name} — ${selected.address}` : placeholder}
      </button>

      {open && (
        <div className="cdd-list ord-nf-addrlist">
          <div className="cdd-search">
            <input
              type="text"
              placeholder="Search saved addresses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="cdd-items" style={{ maxHeight: 280 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 14, fontSize: 12, color: 'var(--ink3)' }}>
                No matching addresses
              </div>
            ) : (
              filtered.map((o) => (
                <div
                  key={o.id}
                  className={`cdd-item ord-nf-addr-item ${o.id === value ? 'on' : ''}`}
                  onClick={() => {
                    onChange(o.id);
                    setOpen(false);
                    setQuery('');
                  }}
                >
                  <div className="ord-nf-addr-row">
                    <div className="ord-nf-addr-name">{o.name}</div>
                    {o.isVerified && (
                      <span className="ord-nf-verified">✓ Verified</span>
                    )}
                    {o.hint && <span className="ord-nf-addr-hint">{o.hint}</span>}
                  </div>
                  <div className="ord-nf-addr-line">{o.address}</div>
                  <div className="ord-nf-addr-meta">
                    {o.phone}{o.email ? ` · ${o.email}` : ''}
                  </div>
                </div>
              ))
            )}
          </div>

          <div
            className="ord-nf-addr-ft"
            onClick={() => {
              setOpen(false);
              onAddNew();
            }}
          >
            + {addNewLabel}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedAddressSelect;
