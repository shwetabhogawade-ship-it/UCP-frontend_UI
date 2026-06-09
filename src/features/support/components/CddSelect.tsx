import React, { useEffect, useRef, useState } from 'react';

interface CddOption {
  value: string;
  label: string;
  desc?: string;
}

interface CddSelectProps {
  id?: string;
  value: string | null;
  placeholder: string;
  options: CddOption[];
  searchable?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

/**
 * Custom drop-down used inside support forms (`.cdd*` look-and-feel).
 * Differs from the dashboard `MultiSelectDropdown` because each option may
 * include a sub-description and selection is single-value.
 */
export const CddSelect: React.FC<CddSelectProps> = ({
  id,
  value,
  placeholder,
  options,
  searchable = false,
  disabled = false,
  onChange,
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

  const selected = options.find((o) => o.value === value) ?? null;
  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div className="cdd" ref={ref} id={id}>
      <button
        type="button"
        className={`cdd-btn ${selected ? '' : 'placeholder'} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setOpen((p) => !p)}
        aria-disabled={disabled}
      >
        {selected ? selected.label : placeholder}
      </button>
      {open && (
        <div className="cdd-list">
          {searchable && (
            <div className="cdd-search">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}
          <div className="cdd-items">
            {filtered.length === 0 ? (
              <div style={{ padding: 12, fontSize: 12, color: 'var(--ink3)' }}>No results</div>
            ) : filtered.map((o) => (
              <div
                key={o.value}
                className={`cdd-item ${o.value === value ? 'on' : ''}`}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                  setQuery('');
                }}
              >
                <div className="cdd-main">{o.label}</div>
                {o.desc && <div className="cdd-desc">{o.desc}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CddSelect;
