import React, { useEffect, useRef, useState } from 'react';

const PRESETS = ['Last Week', 'Last 2 Weeks', 'Last Month', 'Last Quarter'] as const;
type Preset = (typeof PRESETS)[number];

interface DateRangeDropdownProps {
  /** Initial preset; defaults to "Last Week" to match source HTML */
  defaultPreset?: Preset;
  /** Optional change handler — wire to data when API arrives */
  onChange?: (label: string) => void;
}

/**
 * Simple presets-only date selector for the Dashboard header.
 * Lives in dashboard/ instead of reusing reports' `DateFilter` because the
 * dashboard uses different presets and is not bound to reportsStore.
 */
export const DateRangeDropdown: React.FC<DateRangeDropdownProps> = ({
  defaultPreset = 'Last Week',
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(defaultPreset);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (preset: string) => {
    setSelected(preset);
    setOpen(false);
    onChange?.(preset);
  };

  return (
    <div className="dash-df" ref={wrapRef}>
      <button
        type="button"
        className={`dash-df-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span>{selected}</span>
        <span className="arr">▼</span>
      </button>
      {open && (
        <div className="dash-df-dd" role="menu">
          {PRESETS.map((p) => (
            <div
              key={p}
              role="menuitem"
              className={`dash-df-opt ${selected === p ? 'on' : ''}`}
              onClick={() => pick(p)}
            >
              {p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateRangeDropdown;
