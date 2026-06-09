import React from 'react';
import type { AwbRecord } from '../types';

/** Common header row of 4 detail cells (AWB / Courier / Status / EDD). */
const AwbDetailRow: React.FC<{ record: AwbRecord; statusLabel?: string }> = ({ record, statusLabel = 'AWB Status' }) => (
  <div className="awb-detail-row">
    <div className="awb-detail-cell">
      <div className="awb-detail-hdr">AWB</div>
      <div className="awb-detail-val">{record.awb}</div>
    </div>
    <div className="awb-detail-cell">
      <div className="awb-detail-hdr">Courier</div>
      <div className="awb-detail-val ink">{record.courier}</div>
    </div>
    <div className="awb-detail-cell">
      <div className="awb-detail-hdr">{statusLabel}</div>
      <div className="awb-detail-val ink">{record.status}</div>
    </div>
    <div className="awb-detail-cell">
      <div className="awb-detail-hdr">Expected Delivery</div>
      <div className="awb-detail-val ink">{record.edd}</div>
    </div>
  </div>
);

const MovementList: React.FC<{ record: AwbRecord }> = ({ record }) => (
  <div className="mvmt-list">
    {(record.movements ?? []).map((m, i) => (
      <div key={i} className="mvmt-item">
        <div className={`mvmt-dot ${m.cur ? 'cur' : ''}`} />
        <div>
          <div className="mvmt-loc">{m.loc}</div>
          <div className="mvmt-time">{m.time}</div>
          <span className={`st-badge ${m.cur ? 'st-open' : 'st-resolved'}`} style={{ marginTop: 4 }}>
            {m.status}
          </span>
        </div>
      </div>
    ))}
  </div>
);

/** Eligible: green box + SLA + movement timeline + reason input. */
export const EligibleBlock: React.FC<{ record: AwbRecord }> = ({ record }) => (
  <>
    <div className="elig-box">
      <div className="elig-box-title">✓ Eligible for Ticket Creation</div>
      <div className="elig-box-body">
        We&apos;re sorry for the delay in reattempt of your <b>{record.awb}</b>. Please review details and create a ticket.
      </div>
      <AwbDetailRow record={record} />
    </div>

    <div className="sla-block">
      <div className="sla-block-title">Shipment Movement Timeline</div>
      <div className="sla-bar-wrap">
        <div className="sla-bar-fill" style={{ width: `${record.slaPercent ?? 0}%` }} />
      </div>
      <div className="sla-bar-meta">
        <span>Pickup: 14 May</span>
        <span>Expected: {record.edd}</span>
      </div>
      <MovementList record={record} />
    </div>
  </>
);

interface DuplicateBlockProps {
  record: AwbRecord;
  onViewExisting: () => void;
}

/** Duplicate: amber notice + existing-ticket card + guidance list. */
export const DuplicateBlock: React.FC<DuplicateBlockProps> = ({ record, onViewExisting }) => {
  const ex = record.existingTicket;
  if (!ex) return null;
  return (
    <div className="dup-notice">
      <div className="dup-notice-title">
        <span>⚠</span> Ticket for this order already exists
      </div>
      <div className="dup-notice-body">
        A support ticket is already open for AWB <b>{record.awb}</b>. Creating a duplicate is not permitted.
      </div>
      <div className="exist-tk-card">
        <div className="exist-tk-hdr">
          <span className="exist-tk-id">Existing Ticket ID — {ex.id}</span>
          <button type="button" className="view-tk-btn" onClick={onViewExisting}>
            📋 View Ticket
          </button>
        </div>
        <div className="exist-tk-chips">
          <span className="chip">{ex.cat}</span>
          <span className="chip">{ex.sub}</span>
        </div>
        <div className="exist-tk-desc">{ex.desc}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 12, color: 'var(--ink2)' }}>
          <div style={{ fontFamily: 'var(--mono)', color: 'var(--blue)', fontWeight: 600 }}>{ex.id}</div>
          <div className="exist-tk-meta">Created: {ex.date} &nbsp;·&nbsp; Due: {ex.due}</div>
        </div>
      </div>
    </div>
  );
};

/** Ineligible: red banner + amber SLA box + movement history. */
export const IneligibleBlock: React.FC<{ record: AwbRecord }> = ({ record }) => {
  const remaining = (record.slaWindowHours ?? 0) - (record.hoursElapsed ?? 0);
  return (
    <>
      <div className="restrict-banner">
        <div className="restrict-title"><span>✗</span> Ticket Creation Not Permitted</div>
        <div className="restrict-body">
          This shipment is operationally <b>on-time</b> — the SLA window has not been breached. Ticket creation
          for delivery delay issues is only enabled once the SLA window expires.
        </div>
      </div>

      <div className="elig-box warn">
        <div className="elig-box-title">SLA Status — Shipment is On Time</div>
        <AwbDetailRow record={record} statusLabel="Status" />
      </div>

      <div className="sla-block">
        <div className="sla-block-title">SLA Breakdown</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>
          <span>Elapsed: <b>{record.hoursElapsed} hrs</b></span>
          <span>Window: <b>{record.slaWindowHours} hrs</b></span>
          <span style={{ color: 'var(--green)' }}>Remaining: <b>{remaining} hrs</b></span>
        </div>
        <div className="sla-bar-wrap">
          <div className="sla-bar-fill warn" style={{ width: `${record.slaPercent ?? 0}%` }} />
        </div>
        <div className="sla-bar-meta">
          <span>Order placed: {record.orderDate}</span>
          <span>SLA due: {record.slaDue}</span>
        </div>
        <div style={{ background: 'var(--al)', border: '1px solid var(--am)', borderRadius: 8, padding: 11, marginTop: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber)', marginBottom: 5 }}>
            Why can&apos;t I raise a ticket?
          </div>
          <div style={{ fontSize: 12, color: 'var(--amber)', lineHeight: 1.6 }}>
            The issue type requires the SLA window to be exceeded. This shipment has{' '}
            <b>{remaining} hours remaining</b>. If not delivered by <b>{record.slaDue}</b>, this AWB will
            automatically become eligible.
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="sla-block-title">Movement History</div>
          <MovementList record={record} />
        </div>
      </div>
    </>
  );
};

/** Not-found: simple red error banner. */
export const NotFoundBlock: React.FC<{ awb: string }> = ({ awb }) => (
  <div className="err-bar">
    <span>✗</span>
    <div>
      <b>AWB Not Found</b><br />
      AWB <span style={{ fontFamily: 'var(--mono)' }}>{awb}</span> could not be located. Please verify and try again.
    </div>
  </div>
);
