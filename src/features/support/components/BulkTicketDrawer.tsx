import React, { useMemo, useState } from 'react';
import type { BulkAwbRow } from '../types';

interface BulkTicketDrawerProps {
  rows: BulkAwbRow[];
  onClose: () => void;
  onViewTicket: (row: BulkAwbRow) => void;
}

type BulkTab = 'created' | 'not_eligible' | 'exists';

const TAB_DEFS: { id: BulkTab; label: string }[] = [
  { id: 'created',       label: 'Tickets Created' },
  { id: 'not_eligible',  label: 'Not Eligible for Tickets' },
  { id: 'exists',        label: 'Tickets already Exist' },
];

/**
 * "Ticket Requests" results panel — shown after a bulk AWB sheet is
 * processed in the Create Ticket flow. Pure dumb component: parent
 * supplies rows and handles dismissal/navigation.
 */
export const BulkTicketDrawer: React.FC<BulkTicketDrawerProps> = ({ rows, onClose, onViewTicket }) => {
  const [tab, setTab] = useState<BulkTab>('created');
  const [query, setQuery] = useState('');

  const grouped = useMemo(() => ({
    created:      rows.filter((r) => r.status === 'created'),
    not_eligible: rows.filter((r) => r.status === 'not_eligible'),
    exists:       rows.filter((r) => r.status === 'exists'),
  }), [rows]);

  const visible = grouped[tab].filter(
    (r) => r.awb.toLowerCase().includes(query.toLowerCase()) ||
           r.order.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="sup-ov" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sup-panel w-bulk">
        <div className="bulk-hdr">
          <div className="bulk-hdr-back" onClick={onClose}>←</div>
          <div className="bulk-hdr-title">Ticket Requests</div>
        </div>

        <div className="bulk-created-banner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6" />
                <path d="M5.5 8l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Ticket Created
            </div>
            <div className="bulk-created-chips">
              <span className="chip">Shipment NDR &amp; RTO</span>
              <span className="chip" style={{ background: 'var(--s3)' }}>/</span>
              <span className="chip">Issue Over Undelivered Shipment</span>
            </div>
            <div className="bulk-created-desc">Delayed delivery</div>
          </div>
        </div>

        <div className="bulk-body">
          <div className="bulk-status-header">
            <div className="bulk-status-ico">📦</div>
            <div className="bulk-status-title">Ticket Request Status</div>
          </div>

          <div className="bulk-tabs">
            {TAB_DEFS.map((t, idx) => (
              <React.Fragment key={t.id}>
                {idx > 0 && (
                  <div style={{ width: 1, height: 20, background: 'var(--border)', alignSelf: 'center', margin: '0 2px' }} />
                )}
                <button
                  type="button"
                  className={`bulk-tab ${tab === t.id ? 'on' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                  <span className="bulk-tab-count">{grouped[t.id].length}</span>
                </button>
              </React.Fragment>
            ))}
          </div>

          <div className="bulk-search">
            <input
              type="text"
              placeholder="Search by AWB number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div style={{ border: '1px solid var(--border)', borderRadius: 9, overflow: 'hidden', background: 'var(--surface)' }}>
            <table className="btbl">
              <thead>
                <tr>
                  <th>Order ID &amp; AWB</th>
                  <th>Pickup &amp; Delivery Address</th>
                  <th>Last Update</th>
                  {tab === 'created' && <th>Action</th>}
                  {tab === 'not_eligible' && <th>Reason</th>}
                  {tab === 'exists' && <th>Existing Ticket</th>}
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '32px 14px', textAlign: 'center', color: 'var(--ink3)' }}>
                      No matching rows.
                    </td>
                  </tr>
                ) : visible.map((r) => (
                  <tr key={r.awb}>
                    <td>
                      <div className="order-id">{r.order}</div>
                      <div className="awb-num">{r.awb}</div>
                    </td>
                    <td>
                      <div className="addr-col">
                        <div className="addr-row-item">
                          <div className="addr-dot origin" />
                          <div>{r.origin}</div>
                        </div>
                        <div style={{ paddingLeft: 13, borderLeft: '1.5px dashed var(--border2)', marginLeft: 3, height: 10 }} />
                        <div className="addr-row-item">
                          <div className="addr-dot dest" />
                          <div>{r.dest}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{r.lastUpdate}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>{r.lastScan}</div>
                    </td>
                    {tab === 'created' && (
                      <td>
                        <button type="button" className="view-tk-btn" onClick={() => onViewTicket(r)}>
                          📋 View Ticket
                        </button>
                      </td>
                    )}
                    {tab === 'not_eligible' && (
                      <td>
                        <span style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 600 }}>
                          {r.reason}
                        </span>
                      </td>
                    )}
                    {tab === 'exists' && (
                      <td>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--blue)', fontWeight: 600 }}>
                          {r.existingId}
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkTicketDrawer;
