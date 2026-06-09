import React, { useEffect, useMemo, useState } from 'react';
import type { NdrRecord } from '../types';

interface NdrReattemptModalProps {
  record: NdrRecord;
  onClose: () => void;
  onConfirm: (payload: ReattemptPayload) => void;
}

export interface ReattemptPayload {
  recordId: string;
  date: string;
  timeSlot: string;
  remarks: string;
  priority: boolean;
}

const TIME_SLOTS = [
  'Morning (9 AM – 12 PM)',
  'Afternoon (12 PM – 3 PM)',
  'Evening (3 PM – 7 PM)',
  'Any Time',
];

/** Schedule the next delivery attempt for a single NDR row. */
export const NdrReattemptModal: React.FC<NdrReattemptModalProps> = ({
  record,
  onClose,
  onConfirm,
}) => {
  /* Default re-attempt date = tomorrow, ISO `yyyy-mm-dd`. */
  const minDate = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().split('T')[0];
  }, []);

  const [date, setDate] = useState(minDate);
  const [timeSlot, setTimeSlot] = useState('');
  const [remarks, setRemarks] = useState('');
  const [priority, setPriority] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = () => {
    if (!date) {
      setError('Please select a re-attempt date');
      return;
    }
    if (!timeSlot) {
      setError('Please select a time slot');
      return;
    }
    setError(null);
    onConfirm({ recordId: record.id, date, timeSlot, remarks, priority });
  };

  return (
    <div
      className="ord-ov"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ndr-ra-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="ord-modal"
        style={{ width: 520, maxWidth: '92vw' }}
      >
        <div className="ord-modal-hdr">
          <div>
            <div className="ord-modal-title" id="ndr-ra-title">
              Schedule Re-attempt
            </div>
            <div className="ord-drawer-sub" style={{ marginTop: 3 }}>
              Order {record.orderId}
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

        <div className="ord-modal-body" style={{ padding: '20px 22px' }}>
          <div
            style={{
              padding: '12px 14px',
              background: 'var(--al)',
              border: '1px solid var(--am)',
              borderRadius: 8,
              marginBottom: 18,
              fontSize: 12,
              color: 'var(--amber)',
              lineHeight: 1.5,
            }}
          >
            XpressBees will attempt re-delivery on the selected date and time slot.
            Ensure the customer is reachable before confirming.
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              marginBottom: 0,
            }}
          >
            <Field label="Re-attempt Date">
              <input
                type="date"
                className="sup-mi"
                min={minDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
            <Field label="Preferred Time Slot">
              <select
                className="sup-mi"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
              >
                <option value="">Select time slot</option>
                {TIME_SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label={
              <>
                Remarks{' '}
                <span className="sup-ml-hint">(Optional)</span>
              </>
            }
          >
            <textarea
              className="sup-mi-ta"
              style={{ height: 72, resize: 'none' }}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Call before arriving, customer available after 5 PM..."
            />
          </Field>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              cursor: 'pointer',
              fontSize: 12,
              color: 'var(--ink2)',
              marginTop: 14,
            }}
          >
            <input
              type="checkbox"
              checked={priority}
              onChange={(e) => setPriority(e.target.checked)}
              style={{ width: 14, height: 14, accentColor: 'var(--orange)' }}
            />
            <span>
              <b style={{ color: 'var(--ink)' }}>Priority Re-attempt</b> — flag this
              shipment to XpressBees for the earliest available slot
            </span>
          </label>

          {error && (
            <div
              role="alert"
              style={{
                marginTop: 12,
                padding: '8px 12px',
                background: 'var(--rl)',
                color: 'var(--red)',
                fontSize: 12,
                borderRadius: 6,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}
        </div>

        <div className="ord-modal-ft">
          <button type="button" className="ndr-ab ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="ndr-ab primary" onClick={submit}>
            Confirm Re-attempt
          </button>
        </div>
      </div>
    </div>
  );
};

/* Local label + slot helper used by the inputs above. */
const Field: React.FC<{ label: React.ReactNode; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="sup-mf">
    <label className="sup-ml">{label}</label>
    {children}
  </div>
);

export default NdrReattemptModal;
