import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/ui/Toast';
import { useReportsStore } from '../../store/useReportsStore';
import { checkServiceability } from './data/pincodeServiceabilityData';
import { pinInfo } from './data/rateCalculatorData';
import type { PsResult } from './types';

/* ── Inline SVG icons ─────────────────────────────────────────── */

const PinPickupIcon = (
  <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
    <path d="M7 1C5.34 1 4 2.34 4 4c0 2.5 3 6 3 6s3-3.5 3-6c0-1.66-1.34-3-3-3z" fill="#E8520A" />
    <circle cx="7" cy="4" r="1.2" fill="#fff" />
  </svg>
);

const PinDropIcon = (
  <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
    <path d="M7 1C5.34 1 4 2.34 4 4c0 2.5 3 6 3 6s3-3.5 3-6c0-1.66-1.34-3-3-3z" fill="#38A169" />
    <circle cx="7" cy="4" r="1.2" fill="#fff" />
  </svg>
);

const PinListIcon = (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
    <path d="M7 1C5.34 1 4 2.34 4 4c0 2.5 3 6 3 6s3-3.5 3-6c0-1.66-1.34-3-3-3z" />
    <circle cx="7" cy="4" r="1.2" />
  </svg>
);

const CalculatorIcon = (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
    <rect x="2" y="1" width="10" height="12" rx="1.5" />
    <path d="M4 4h6M4 7h2M7 7h1.5M10 7h.5M4 10h2M7 10h1.5M10 10h.5" strokeLinecap="round" />
  </svg>
);

const RateCardIcon = (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
    <rect x="1" y="1" width="12" height="12" rx="2" />
    <path d="M3 5h8M3 8h5" strokeLinecap="round" />
  </svg>
);

const CheckIcon = (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" width="12" height="12">
    <path d="M2 7l3.5 3.5L12 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TickIcon = (
  <svg viewBox="0 0 12 12" fill="none" stroke="var(--green)" strokeWidth="2" width="10" height="10">
    <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossIcon = (
  <svg viewBox="0 0 12 12" fill="none" stroke="var(--ink3)" strokeWidth="1.8" width="10" height="10">
    <path d="M3 3l6 6M9 3l-6 6" strokeLinecap="round" />
  </svg>
);

const EmptyStateIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="52" height="52">
    <path d="M12 2C8.68 2 6 4.68 6 8c0 5 6 12 6 12s6-7 6-12c0-3.32-2.68-6-6-6z" />
    <circle cx="12" cy="8" r="2.5" />
  </svg>
);

/**
 * Pincode Serviceability screen for the Information Center module.
 *
 * Layout:
 *
 *   Breadcrumb
 *   Title row + header CTAs:
 *     • Rate Calculator (secondary, navigates)
 *     • Rate Card        (secondary, navigates)
 *     • Check Active Pincodes (primary, triggers serviceability check)
 *   ┌────────────────────┬──────────────────────────────────────────┐
 *   │ Form card          │ Result panel                             │
 *   │  • Origin pincode  │  • Empty state OR                        │
 *   │  • Dest pincode    │    title + serviceable / unserviceable   │
 *   │  • Check button    │    chip + zone strip + service rows      │
 *   └────────────────────┴──────────────────────────────────────────┘
 */
export const PincodeServiceabilityPage: React.FC = () => {
  const navigate   = useNavigate();
  const showToast  = useReportsStore((s) => s.showToast);
  const toastState = useReportsStore((s) => s.toast);

  const [origin, setOrigin] = useState('');
  const [dest,   setDest]   = useState('');
  const [result, setResult] = useState<PsResult | null>(null);

  /* ─── Derived helpers — show preview city info as user types ── */
  const originPreview = useMemo(() => pinInfo(origin.trim()), [origin]);
  const destPreview   = useMemo(() => pinInfo(dest.trim()),   [dest]);

  /* ─── Handlers ────────────────────────────────────────────── */

  const handleCheck = useCallback(() => {
    const pu = origin.trim();
    const dr = dest.trim();
    if (pu.length !== 6 || Number.isNaN(Number(pu))) {
      showToast('Please enter a valid 6-digit origin pincode');
      return;
    }
    if (dr.length !== 6 || Number.isNaN(Number(dr))) {
      showToast('Please enter a valid 6-digit destination pincode');
      return;
    }
    const next = checkServiceability(pu, dr);
    if (!next) {
      showToast('Could not check serviceability');
      return;
    }
    setResult(next);
    showToast('Serviceability checked');
  }, [origin, dest, showToast]);

  /* ─── Render ──────────────────────────────────────────────── */

  return (
    <div className="page">
      {/* Breadcrumb */}
      <div className="ic-breadcrumb">
        <span>Information Center</span>
        <span className="ic-breadcrumb-sep">›</span>
        <span className="ic-breadcrumb-current">Pincode Serviceability</span>
      </div>

      {/* Page header */}
      <div className="ic-rc-header">
        <div>
          <div className="ic-rc-title">Pincode Serviceability</div>
          <div className="ic-rc-subtitle">
            Check delivery serviceability for any pincode across India
          </div>
        </div>
        <div className="ic-rc-cta-row">
          <button
            type="button"
            className="ic-tbtn"
            onClick={() => navigate('/info/rate-calculator')}
          >
            {CalculatorIcon} Rate Calculator
          </button>
          <button
            type="button"
            className="ic-tbtn"
            onClick={() => navigate('/info/rate-card')}
          >
            {RateCardIcon} Rate Card
          </button>
          <button
            type="button"
            className="ic-tbtn ic-tbtn-p"
            onClick={handleCheck}
          >
            {PinListIcon} Check Active Pincodes
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="ic-ps-layout">
        {/* LEFT: Form */}
        <div className="ic-ps-form">
          <div className="ic-field">
            <div className="ic-field-label" style={{ marginBottom: 8 }}>
              Origin Pincode
            </div>
            <div className="ic-pincode-input-wrap">
              <div className="ic-pin-icon">{PinPickupIcon}</div>
              <input
                type="text"
                inputMode="numeric"
                value={origin}
                maxLength={6}
                placeholder="e.g. 411006"
                onChange={(e) => setOrigin(e.target.value.replace(/\D/g, ''))}
                aria-label="Origin pincode"
              />
              <div className="ic-pin-state">{originPreview?.[2] ?? ''}</div>
            </div>
            <div className="ic-pin-city">
              {originPreview ? `${originPreview[0]}, ${originPreview[1]}` : ''}
            </div>
          </div>

          <div className="ic-field" style={{ marginTop: 16 }}>
            <div className="ic-field-label" style={{ marginBottom: 8 }}>
              Destination Pincode
            </div>
            <div className="ic-pincode-input-wrap">
              <div className="ic-pin-icon">{PinDropIcon}</div>
              <input
                type="text"
                inputMode="numeric"
                value={dest}
                maxLength={6}
                placeholder="e.g. 560025"
                onChange={(e) => setDest(e.target.value.replace(/\D/g, ''))}
                aria-label="Destination pincode"
              />
              <div className="ic-pin-state">{destPreview?.[2] ?? ''}</div>
            </div>
            <div className="ic-pin-city">
              {destPreview ? `${destPreview[0]}, ${destPreview[1]}` : ''}
            </div>
          </div>

          <button
            type="button"
            className="ic-btn-calc ic-ps-check-btn"
            onClick={handleCheck}
          >
            {CheckIcon} Check Serviceability
          </button>
        </div>

        {/* RIGHT: Result panel */}
        <div className="ic-ps-result">
          <div className="ic-ps-result-header">
            <div className="ic-ps-result-title">
              {result
                ? `${result.originInfo?.[0] ?? `Pincode ${result.origin}`} → ${result.destInfo?.[0] ?? `Pincode ${result.destination}`}`
                : 'Serviceability Check'}
            </div>
            {result && (
              <span className={`ic-ps-pill ${result.status}`}>
                {result.status === 'serviceable' ? '✓ Serviceable' : '✗ Not Serviceable'}
              </span>
            )}
          </div>

          {!result ? (
            <div className="ic-ps-empty">
              {EmptyStateIcon}
              <div className="ic-result-empty-title">
                Enter pincodes to check serviceability
              </div>
              <div className="ic-result-empty-sub">
                Enter origin and destination pincodes to see available
                shipping services, estimated delivery times, and COD availability.
              </div>
            </div>
          ) : (
            <>
              {result.status === 'serviceable' && (
                <div className="ic-ps-zone-strip">
                  <strong>{result.zoneLabel}</strong>
                  <span className="ic-ps-zone-sep">·</span>
                  Est. delivery: <strong>{result.etaLabel}</strong>
                </div>
              )}
              {result.services.map((s) => (
                <div key={s.name} className="ic-ps-service-row">
                  <div>
                    <div className="ic-ps-service-name">
                      <span aria-hidden="true">{s.icon}</span> {s.name}
                    </div>
                    <div className="ic-ps-service-detail">{s.detail}</div>
                  </div>
                  <div className={`ic-ps-check-icon ${s.ok ? 'ok' : 'na'}`}>
                    {s.ok ? TickIcon : CrossIcon}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {toastState && <Toast />}
    </div>
  );
};

export default PincodeServiceabilityPage;
