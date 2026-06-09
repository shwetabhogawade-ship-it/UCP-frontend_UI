import React, { useEffect, useMemo, useState } from 'react';
import { calcVolumetricWeight, type SavedPackage } from '../data/forwardOrderData';

interface PackageDrawerProps {
  mode: 'create' | 'edit';
  /** Existing package when editing — undefined when creating a new one. */
  pkg?: SavedPackage;
  onClose: () => void;
  onSave: (pkg: SavedPackage) => void;
}

/* Side drawer for adding or editing a saved package preset. Reuses the same
   `.sup-panel.w-create` shell as the PickupDrawer so users get a consistent
   experience across all package-management surfaces. */
export const PackageDrawer: React.FC<PackageDrawerProps> = ({ mode, pkg, onClose, onSave }) => {
  const [name, setName]           = useState(pkg?.name ?? '');
  const [physical, setPhysical]   = useState<string>(pkg ? String(pkg.physicalWeight) : '');
  const [length, setLength]       = useState<string>(pkg ? String(pkg.length) : '');
  const [breadth, setBreadth]     = useState<string>(pkg ? String(pkg.breadth) : '');
  const [height, setHeight]       = useState<string>(pkg ? String(pkg.height) : '');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const volumetric = useMemo(() => {
    const l = Number(length), b = Number(breadth), h = Number(height);
    if (!l || !b || !h) return 0;
    return calcVolumetricWeight(l, b, h);
  }, [length, breadth, height]);

  const canSubmit = !!name.trim() && Number(physical) > 0 && Number(length) > 0 && Number(breadth) > 0 && Number(height) > 0;

  const handleSave = () => {
    if (!canSubmit) return;
    onSave({
      id: pkg?.id ?? `pkg-${Date.now()}`,
      name: name.trim(),
      physicalWeight: Number(physical),
      length: Number(length),
      breadth: Number(breadth),
      height: Number(height),
    });
  };

  return (
    <div className="sup-ov" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sup-panel w-create" style={{ width: 560 }}>
        <div className="sup-panel-hdr">
          <div className="sup-panel-hdr-t">
            <div>
              <div className="sup-panel-title">
                {mode === 'create' ? 'New Saved Package' : 'Edit Saved Package'}
              </div>
              <div className="sup-panel-sub">
                Save a reusable package preset to auto-fill weight &amp; dimensions
              </div>
            </div>
            <div className="sup-panel-x" onClick={onClose}>✕</div>
          </div>
        </div>

        <div className="sup-panel-body">
          <div className="sup-mf">
            <div className="sup-ml">Package Name <span style={{ color: 'var(--red)' }}>*</span></div>
            <input
              className="sup-mi"
              type="text"
              placeholder="e.g. Gemstone Multi Pack"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="sup-row">
            <NumField
              label="Physical Weight"
              unit="kg"
              value={physical}
              onChange={setPhysical}
              required
            />
            <NumField
              label="Volumetric Weight"
              unit="kg"
              value={volumetric ? volumetric.toFixed(2) : ''}
              onChange={() => {}}
              readOnly
              hint="Derived from L × B × H ÷ 5000"
            />
          </div>

          <div className="ord-nf-sec-lbl" style={{ marginTop: 6 }}>Size of Package</div>
          <div className="ord-nf-dims">
            <NumField label="Length"  unit="cm" value={length}  onChange={setLength}  required />
            <NumField label="Breadth" unit="cm" value={breadth} onChange={setBreadth} required />
            <NumField label="Height"  unit="cm" value={height}  onChange={setHeight}  required />
          </div>
        </div>

        <div className="sup-panel-ft">
          <button type="button" className="ord-cta ord-cta-s" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="ord-cta ord-cta-p"
            disabled={!canSubmit}
            style={!canSubmit ? { opacity: .5, cursor: 'not-allowed' } : undefined}
            onClick={handleSave}
          >
            {mode === 'create' ? 'Add Package' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface NumFieldProps {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  required?: boolean;
  hint?: string;
}
const NumField: React.FC<NumFieldProps> = ({ label, unit, value, onChange, readOnly, required, hint }) => (
  <div className="sup-mf">
    <div className="sup-ml">
      {label} {required && <span style={{ color: 'var(--red)' }}>*</span>}
    </div>
    <div className="ord-nf-unit">
      <input
        className="sup-mi"
        type="text"
        inputMode="decimal"
        placeholder="0.00"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
        style={readOnly ? { background: 'var(--s3)', color: 'var(--ink2)' } : undefined}
      />
      <span className="ord-nf-unit-suffix">{unit}</span>
    </div>
    {hint && <div className="sup-ml-hint" style={{ marginTop: 4 }}>{hint}</div>}
  </div>
);

export default PackageDrawer;
