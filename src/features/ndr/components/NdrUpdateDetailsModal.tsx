import React, { useEffect, useState } from 'react';
import type { NdrRecord } from '../types';

interface NdrUpdateDetailsModalProps {
  record: NdrRecord;
  onClose: () => void;
  onConfirm: (payload: UpdateDetailsPayload) => void;
}

export interface UpdateDetailsPayload {
  recordId: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
  state: string;
  altPhone: string;
  reattemptDate: string;
  preferredTime: string;
  remarks: string;
  priority: boolean;
}

const REATTEMPT_DATE_OPTIONS = [
  'Tomorrow, 10 Apr 2026',
  '11 Apr 2026',
  '12 Apr 2026',
];
const PREFERRED_TIME_OPTIONS = [
  '',
  'Morning (9AM – 12PM)',
  'Afternoon (12PM – 4PM)',
  'Evening (4PM – 8PM)',
];

/**
 * Reattempt + address-correction modal triggered from the per-row
 * "Update Details" action. Shows the customer's previous address in a
 * read-only pane on the left and a stack of editable inputs on the
 * right so reps can spot deltas at a glance.
 */
export const NdrUpdateDetailsModal: React.FC<NdrUpdateDetailsModalProps> = ({
  record: r,
  onClose,
  onConfirm,
}) => {
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [stateName, setStateName] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [reattemptDate, setReattemptDate] = useState(REATTEMPT_DATE_OPTIONS[0]);
  const [preferredTime, setPreferredTime] = useState('');
  const [remarks, setRemarks] = useState('');
  const [priority, setPriority] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = () => {
    onConfirm({
      recordId: r.id,
      addressLine1,
      addressLine2,
      city,
      pincode,
      state: stateName,
      altPhone,
      reattemptDate,
      preferredTime,
      remarks,
      priority,
    });
  };

  return (
    <div
      className="ord-ov"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ndr-upd-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="ord-modal"
        style={{ width: 720, maxWidth: '96vw', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="ord-modal-hdr">
          <div>
            <div className="ord-modal-title" id="ndr-upd-title">
              Update Details
            </div>
            <div
              className="ord-drawer-sub"
              style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Reason for NDR Failure:{' '}
              <b style={{ color: 'var(--red)' }}>{r.reason}</b>
            </div>
          </div>
          <button
            type="button"
            className="ord-modal-x"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="ord-modal-body" style={{ padding: '20px 22px', overflowY: 'auto' }}>
          {/* Two-panel: Previous (read-only) | New address (inputs) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 0,
              border: '1px solid var(--border)',
              borderRadius: 10,
              overflow: 'hidden',
              marginBottom: 16,
            }}
          >
            {/* LEFT — previous address */}
            <div
              style={{
                padding: '16px 18px',
                background: 'var(--s2)',
                borderRight: '1px solid var(--border)',
              }}
            >
              <SectionHeader
                dotColor="var(--ink3)"
                label="Previous address"
                labelColor="var(--ink3)"
                badge={{ text: 'Read only', bg: 'var(--border)', fg: 'var(--ink3)' }}
              />
              <ReadField label="Customer" value={r.customerName} />
              <div style={{ height: 1, background: 'var(--border)', margin: '11px 0' }} />
              <ReadField label="Delivery address" value={r.deliveryAddress} multiline />
              <div style={{ height: 1, background: 'var(--border)', margin: '11px 0' }} />
              <ReadField label="Contact" value={r.customerPhone} mono />
            </div>

            {/* RIGHT — new address inputs */}
            <div style={{ padding: '16px 18px', background: 'var(--surface)' }}>
              <SectionHeader
                dotColor="var(--orange)"
                label="New address"
                labelColor="var(--orange)"
                badge={{
                  text: 'Corrected details',
                  bg: 'var(--ol)',
                  fg: 'var(--orange)',
                  border: 'var(--om)',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <FormField label="Address Line 1" optional>
                  <input
                    className="sup-mi"
                    placeholder="House / flat no., street, area"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                  />
                </FormField>
                <FormField label="Address Line 2" optional>
                  <input
                    className="sup-mi"
                    placeholder="Landmark, nearby area"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </FormField>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <FormField label="City" optional>
                    <input
                      className="sup-mi"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </FormField>
                  <FormField label="Pincode" optional>
                    <input
                      className="sup-mi"
                      placeholder="6-digit"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) =>
                        setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))
                      }
                    />
                  </FormField>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <FormField label="State" optional>
                    <input
                      className="sup-mi"
                      placeholder="State"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                    />
                  </FormField>
                  <FormField label="Alt. phone" optional>
                    <input
                      className="sup-mi"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                    />
                  </FormField>
                </div>
              </div>
            </div>
          </div>

          {/* Re-attempt scheduling */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              marginBottom: 14,
            }}
          >
            <FormField label="Re-attempt Date">
              <select
                className="sup-mi"
                value={reattemptDate}
                onChange={(e) => setReattemptDate(e.target.value)}
              >
                {REATTEMPT_DATE_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Preferred Delivery Time" optional>
              <select
                className="sup-mi"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
              >
                {PREFERRED_TIME_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt || 'Any time'}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Remarks" optional>
            <textarea
              className="sup-mi-ta"
              placeholder="Enter your remarks here..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              style={{ minHeight: 72 }}
            />
          </FormField>

          {/* Priority checkbox */}
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '12px 14px',
              background: 'var(--ol)',
              border: '1px solid var(--om)',
              borderRadius: 9,
              cursor: 'pointer',
              marginTop: 14,
            }}
          >
            <input
              type="checkbox"
              checked={priority}
              onChange={(e) => setPriority(e.target.checked)}
              style={{
                width: 15,
                height: 15,
                accentColor: 'var(--orange)',
                marginTop: 2,
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--orange)',
                  lineHeight: 1.45,
                }}
              >
                Mark as Priority Re-Attempt
              </div>
              <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 2 }}>
                Escalates to carrier for earliest available delivery slot
              </div>
            </div>
          </label>
        </div>

        <div className="ord-modal-ft">
          <button type="button" className="ndr-ab ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="ndr-ab primary" onClick={submit}>
            Confirm Re-Attempt
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Internal markup helpers — keep the JSX above readable ── */

const SectionHeader: React.FC<{
  dotColor: string;
  label: string;
  labelColor: string;
  badge: { text: string; bg: string; fg: string; border?: string };
}> = ({ dotColor, label, labelColor, badge }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
    <div
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: dotColor,
        flexShrink: 0,
      }}
    />
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: labelColor,
        textTransform: 'uppercase',
        letterSpacing: '.5px',
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: 10,
        fontWeight: 500,
        padding: '2px 8px',
        borderRadius: 4,
        background: badge.bg,
        color: badge.fg,
        border: badge.border ? `1px solid ${badge.border}` : undefined,
        marginLeft: 'auto',
      }}
    >
      {badge.text}
    </span>
  </div>
);

const ReadField: React.FC<{
  label: string;
  value: string;
  mono?: boolean;
  multiline?: boolean;
}> = ({ label, value, mono, multiline }) => (
  <div>
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        color: 'var(--ink3)',
        marginBottom: 3,
        textTransform: 'uppercase',
        letterSpacing: '.3px',
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 12,
        color: 'var(--ink2)',
        lineHeight: multiline ? 1.7 : 1.4,
        fontWeight: multiline ? 400 : 500,
        fontFamily: mono ? 'var(--mono)' : 'var(--font)',
      }}
    >
      {value}
    </div>
  </div>
);

const FormField: React.FC<{
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}> = ({ label, optional, children }) => (
  <div className="sup-mf">
    <label className="sup-ml">
      {label} {optional && <span className="sup-ml-hint">(Optional)</span>}
    </label>
    {children}
  </div>
);

export default NdrUpdateDetailsModal;
