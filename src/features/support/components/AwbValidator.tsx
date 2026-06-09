import React, { useState } from 'react';
import type { AwbValidationOutcome } from '../types';
import { AWB_DB } from '../data/supportData';

interface AwbValidatorProps {
  /** Notified whenever the validation result changes (success/duplicate/etc). */
  onChange: (outcome: AwbValidationOutcome) => void;
  /** Render the validate button label (default "Validate"). */
  buttonLabel?: string;
}

/**
 * AWB number input with an inline Validate button. Looks up `AWB_DB` and
 * surfaces the result via `onChange` so the parent form can render the
 * appropriate eligibility / duplicate / restriction block.
 */
export const AwbValidator: React.FC<AwbValidatorProps> = ({ onChange, buttonLabel = 'Validate' }) => {
  const [awb, setAwb] = useState('');
  const [outcome, setOutcome] = useState<AwbValidationOutcome>({ kind: 'idle' });

  const setBoth = (next: AwbValidationOutcome) => {
    setOutcome(next);
    onChange(next);
  };

  const handleValidate = () => {
    const trimmed = awb.trim();
    if (!trimmed) {
      setBoth({ kind: 'idle' });
      return;
    }
    setBoth({ kind: 'loading' });
    window.setTimeout(() => {
      const record = AWB_DB[trimmed];
      if (!record) {
        setBoth({ kind: 'not_found', awb: trimmed });
      } else if (record.duplicate) {
        setBoth({ kind: 'duplicate', record });
      } else if (record.ineligible) {
        setBoth({ kind: 'ineligible', record });
      } else if (record.eligible) {
        setBoth({ kind: 'eligible', record });
      } else {
        setBoth({ kind: 'not_found', awb: trimmed });
      }
    }, 750);
  };

  let hint: React.ReactNode = null;
  if (outcome.kind === 'loading') {
    hint = <div className="field-hint info">Validating AWB…</div>;
  } else if (outcome.kind === 'not_found') {
    hint = <div className="field-hint err">✗ AWB not found in system.</div>;
  } else if (outcome.kind === 'duplicate') {
    hint = <div className="field-hint err">✗ An open ticket already exists for this AWB.</div>;
  } else if (outcome.kind === 'ineligible') {
    hint = <div className="field-hint err">✗ Shipment is not eligible for ticket creation at this time.</div>;
  } else if (outcome.kind === 'eligible') {
    hint = <div className="field-hint ok">✓ AWB validated — shipment is eligible.</div>;
  }

  return (
    <>
      <div className="awb-row">
        <input
          className="sup-mi"
          type="text"
          placeholder="Enter AWB number (try 1234567890, 0987654321, 2345678901)"
          value={awb}
          onChange={(e) => {
            setAwb(e.target.value);
            if (outcome.kind !== 'idle') setBoth({ kind: 'idle' });
          }}
        />
        <button type="button" className="awb-validate-btn" onClick={handleValidate}>
          {buttonLabel}
        </button>
      </div>
      {hint}
    </>
  );
};

export default AwbValidator;
