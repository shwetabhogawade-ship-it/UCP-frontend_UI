import React from 'react';
import type { TabId, Ticket } from '../types';
import { STATUS_LABEL } from '../data/supportData';

interface TicketsTableProps {
  rows: Ticket[];
  tab: TabId;
  onView: (ticket: Ticket, viewOnly: boolean) => void;
  onUpdate: (ticket: Ticket) => void;
  onReopen: (ticket: Ticket) => void;
}

/**
 * Tickets table — re-uses the shared `.tw / .stbl` table chrome from
 * `reports.css` so support/reports tables look identical.
 *
 * The Action column changes per tab:
 *  • Open    → "Update" (primary) + "View History" link
 *  • Resolved→ "↩ Reopen" + "X hrs left" / "expired" + "View History"
 *  • Closed  → "View History" link only
 */
export const TicketsTable: React.FC<TicketsTableProps> = ({
  rows,
  tab,
  onView,
  onUpdate,
  onReopen,
}) => {
  return (
    <div className="tw">
      <div className="ts">
        <table className="stbl">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>AWB(s)</th>
              <th>Subcategory</th>
              <th>Ticket Status</th>
              <th>Resolution Due By</th>
              <th>Last Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => {
              const meta = STATUS_LABEL[t.status];
              return (
                <tr key={t.id} className={t.isNew ? 'row-new' : undefined}>
                  <td>
                    <div className="td-id">
                      {t.id}
                      {t.isNew && <span className="tk-new">NEW</span>}
                    </div>
                    <div className="td-date">{t.date}, {t.time}</div>
                  </td>
                  <td>
                    <span className="td-awb">{t.awb}</span>
                  </td>
                  <td>{t.sub}</td>
                  <td>
                    <span className={`st-badge ${meta.cls}`}>{meta.label}</span>
                  </td>
                  <td>
                    <div>{t.due}</div>
                    <span className={`sla-badge ${t.sla === 'ok' ? 'sla-ok' : 'sla-breach'}`}>
                      {t.sla === 'ok' ? 'WITHIN SLA' : 'SLA BREACHED'}
                    </span>
                  </td>
                  <td>{t.updated}</td>
                  <td>
                    {tab === 'closed' ? (
                      <div className="act-col">
                        <button type="button" className="ab-link" onClick={() => onView(t, true)}>
                          View History
                        </button>
                      </div>
                    ) : tab === 'resolved' ? (
                      <div className="act-col">
                        {typeof t.reopenHrsLeft === 'number' && t.reopenHrsLeft > 0 ? (
                          <>
                            <button type="button" className="ab-reopen" onClick={() => onReopen(t)}>
                              ↩ Reopen
                            </button>
                            <span className="reopen-timer">⏱ {t.reopenHrsLeft} hrs left</span>
                          </>
                        ) : (
                          <>
                            <button type="button" className="ab-reopen-exp" disabled>
                              ↩ Reopen
                            </button>
                            <span className="reopen-timer exp">Window expired</span>
                          </>
                        )}
                        <button type="button" className="ab-link" onClick={() => onView(t, true)}>
                          View History
                        </button>
                      </div>
                    ) : (
                      <div className="act-col">
                        <button type="button" className="ab ab-p" onClick={() => onUpdate(t)}>
                          Update
                        </button>
                        <button type="button" className="ab-link" onClick={() => onView(t, false)}>
                          View History
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--ink3)', fontSize: 12 }}>
                  No tickets match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="tf">
        <div className="tf-info">
          Showing <b>1–{rows.length}</b> of <b>{rows.length}</b>
        </div>
        <div className="pgw">
          <div className="pgb">←</div>
          <div className="pgb on">1</div>
          <div className="pgb">→</div>
        </div>
      </div>
    </div>
  );
};

export default TicketsTable;
