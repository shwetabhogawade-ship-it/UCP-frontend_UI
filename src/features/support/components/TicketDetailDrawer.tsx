import React from 'react';
import type { Ticket } from '../types';
import { STATUS_LABEL } from '../data/supportData';

interface TicketDetailDrawerProps {
  ticket: Ticket;
  /** When true, hides the input/submit footer (used for closed/resolved tickets). */
  viewOnly: boolean;
  onClose: () => void;
  onMarkResolved: (id: string) => void;
  onSendMessage: () => void;
  onSubmitUpdate: () => void;
}

/**
 * Right-side conversation panel. Reuses the same drawer overlay shell as
 * the Reports drawer but with support-specific content (chips, bubbles,
 * mark-as-resolved CTA).
 */
export const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({
  ticket,
  viewOnly,
  onClose,
  onMarkResolved,
  onSendMessage,
  onSubmitUpdate,
}) => {
  const meta = STATUS_LABEL[ticket.status];
  const isOpenLike = ticket.status !== 'resolved' && ticket.status !== 'closed';

  return (
    <div className="sup-ov" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sup-panel w-detail">
        <div className="sup-panel-hdr">
          <div className="sup-panel-hdr-t">
            <div>
              <div className="sup-panel-title">Ticket Details</div>
              <div className="sup-panel-sub">Ticket ID</div>
            </div>
            <div className="sup-panel-x" onClick={onClose}>✕</div>
          </div>
        </div>

        <div className="sup-panel-body">
          <div className="conv-hdr">
            <div>
              <div className="conv-tk-id">{ticket.id}</div>
              <div className="conv-tk-sub">Ticket ID</div>
              <div className="conv-meta-chips">
                <span className="conv-meta-chip">
                  <span className={`st-badge ${meta.cls}`}>{meta.label}</span>
                </span>
                <span className="conv-meta-chip">📅 Last Update: {ticket.updated}</span>
                <span className="conv-meta-chip">👤 Seller Account</span>
              </div>
            </div>
            {!viewOnly && isOpenLike && (
              <button type="button" className="mark-resolved-btn" onClick={() => onMarkResolved(ticket.id)}>
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="8" r="6" />
                  <path d="M5.5 8l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Mark as Resolved
              </button>
            )}
          </div>

          <div className="conv-box">
            <div className="conv-box-hdr">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2h12v10H2z" strokeLinejoin="round" />
                <path d="M5 6h6M5 8h4" strokeLinecap="round" />
              </svg>
              Support Conversations
            </div>

            <div className="conv-msg-list">
              <div className="conv-msg seller">
                <div className="conv-avatar seller">You</div>
                <div>
                  <div className="conv-bubble seller">
                    Delayed delivery Object ID: {ticket.awb}
                  </div>
                  <div className="conv-ts" style={{ textAlign: 'right' }}>
                    {ticket.date}, {ticket.time}
                  </div>
                </div>
              </div>
              <div className="conv-msg">
                <div className="conv-avatar support">XB</div>
                <div>
                  <div className="conv-bubble support">
                    Dear Customer,<br />
                    Your response has been registered with the reference number: <b>{ticket.id}</b>.
                    We will get back to you within 24hrs.<br /><br />
                    Team XpressBees
                  </div>
                  <div className="conv-ts">{ticket.date}, {ticket.time}</div>
                </div>
              </div>
            </div>

            <div className="conv-reply-hint">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6" />
                <path d="M8 5v3l2 1" strokeLinecap="round" />
              </svg>
              You can expect a response within 1 business day
            </div>

            {!viewOnly && (
              <div className="conv-input-area">
                <input className="conv-input" type="text" placeholder="Enter your message" />
                <button type="button" className="conv-send" onClick={onSendMessage}>
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="#fff" strokeWidth="1.8">
                    <path d="M14 2L2 7l5 2m7-7L9 14l-2-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button type="button" className="conv-attach">
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="2" width="10" height="12" rx="2" />
                    <path d="M5 5h6M5 7h6M5 9h4" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="sup-panel-ft">
          <button type="button" className="btn btn-s" onClick={onClose}>Close</button>
          {!viewOnly && (
            <button type="button" className="btn btn-p" onClick={onSubmitUpdate}>
              Submit Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailDrawer;
