import React, { useEffect, useState } from 'react';

export interface BulkPackageDetails {
  length: number;
  breadth: number;
  height: number;
  /** Package weight in grams (per the reference design). */
  weightGrams: number;
}

interface BulkPackageDetailsModalProps {
  selectedCount: number;
  onClose: () => void;
  onConfirm: (details: BulkPackageDetails) => void;
}

/**
 * Bulk Package Details modal.
 *
 * Mirrors the reference popup — Length / Breadth / Height (cm) on row 1
 * and Package Weight (gm) on row 2, with two footer CTAs (Close +
 * Package Update). Uses the same `.sup-mf`, `.sup-ml`, `.sup-mi` and
 * `.ord-nf-unit*` tokens as the Package Details card on the New Order
 * Creation screen — typing in this modal feels identical to typing on
 * the create page.
 */
export const BulkPackageDetailsModal: React.FC<BulkPackageDetailsModalProps> = ({
  selectedCount,
  onClose,
  onConfirm,
}) => {
  const [length,  setLength]  = useState<string>('');
  const [breadth, setBreadth] = useState<string>('');
  const [height,  setHeight]  = useState<string>('');
  const [weight,  setWeight]  = useState<string>('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const canSubmit =
    Number(length)  > 0 &&
    Number(breadth) > 0 &&
    Number(height)  > 0 &&
    Number(weight)  > 0;

  const handleConfirm = () => {
    if (!canSubmit) return;
    onConfirm({
      length:      Number(length),
      breadth:     Number(breadth),
      height:      Number(height),
      weightGrams: Number(weight),
    });
  };

  return (
    <div
      className="ord-ov"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-pkg-title"
    >
      <div
        className="ord-modal"
        style={{ width: 620 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ord-modal-hdr">
          <div>
            <div className="ord-modal-title" id="bulk-pkg-title">
              Bulk Package Details
            </div>
            <div className="ord-modal-sub">
              Update Dimensions Details &amp; Weight of the Package ·{' '}
              {selectedCount} order{selectedCount > 1 ? 's' : ''} selected
            </div>
          </div>
          <button type="button" className="ord-modal-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="ord-modal-body">
          {/* Row 1 — Length · Breadth · Height (cm). Uses the same dim
              grid token as the New Order Package card so column ratios
              match the rest of the platform. */}
          <div className="ord-nf-dims">
            <UnitField label="Length"  unit="cm" value={length}  onChange={setLength}  required />
            <UnitField label="Breadth" unit="cm" value={breadth} onChange={setBreadth} required />
            <UnitField label="Height"  unit="cm" value={height}  onChange={setHeight}  required />
          </div>

          {/* Row 2 — Package weight (gm). Constrained to half the row so
              the input doesn't sprawl across an empty grid cell. */}
          <div className="sup-row" style={{ marginTop: 16 }}>
            <UnitField
              label="Package Wt."
              unit="gm"
              value={weight}
              onChange={setWeight}
              required
            />
            <div /> {/* spacer keeps the input at 1/2 width */}
          </div>
        </div>

        <div className="ord-modal-ft">
          <button type="button" className="ord-cta ord-cta-s" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="ord-cta ord-cta-p"
            onClick={handleConfirm}
            disabled={!canSubmit}
            style={!canSubmit ? { opacity: .55, cursor: 'not-allowed' } : undefined}
          >
            Package Update
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Local field — mirrors the UnitField helper used by the New Order
   screen so input layout, suffix chip and asterisk all line up 1-to-1
   with how users see them on the create page. ─── */

interface UnitFieldProps {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}
const UnitField: React.FC<UnitFieldProps> = ({
  label, unit, value, onChange, required,
}) => (
  <div className="sup-mf" style={{ marginBottom: 0 }}>
    <div className="sup-ml">
      {label}
      {required && <span style={{ color: 'var(--red)' }}> *</span>}
    </div>
    <div className="ord-nf-unit">
      <input
        className="sup-mi"
        type="text"
        inputMode="decimal"
        placeholder="0"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
      />
      <span className="ord-nf-unit-suffix">{unit}</span>
    </div>
  </div>
);

export default BulkPackageDetailsModal;
