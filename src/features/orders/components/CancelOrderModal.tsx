import React from 'react';
import type { Order } from '../types';

interface CancelOrderModalProps {
  /** Single order or a list (when triggered from bulk action). */
  orders: Order[];
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Confirmation modal shown before cancelling one or many orders. The danger
 * card calls out the destructive nature; the primary CTA is intentionally
 * red so the user can't miss it.
 */
export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  orders,
  onClose,
  onConfirm,
}) => {
  const isBulk = orders.length > 1;
  const totalValue = orders.reduce((sum, o) => sum + o.payment.amount, 0);

  return (
    <div
      className="ord-ov"
      onClick={onClose}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="cancel-order-title"
    >
      <div className="ord-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ord-modal-hdr">
          <div className="ord-modal-title" id="cancel-order-title">
            {isBulk ? `Cancel ${orders.length} orders?` : 'Cancel this order?'}
          </div>
          <button type="button" className="ord-modal-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="ord-modal-body">
          <div className="ord-warn">
            <div className="ord-warn-ico" aria-hidden="true">!</div>
            <div className="ord-warn-text">
              <b>This action cannot be undone.</b><br />
              Cancelling will release inventory back to your channel, void the COD/Prepaid
              allocation, and notify the customer. If a pickup has already been booked you'll
              need to cancel that separately.
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.6 }}>
            {isBulk ? (
              <>
                You're about to cancel <b style={{ color: 'var(--ink)' }}>{orders.length} orders</b> with a
                combined value of <b style={{ color: 'var(--ink)' }}>
                  ₹{totalValue.toLocaleString('en-IN')}
                </b>.
              </>
            ) : (
              <>
                Order ID <b style={{ color: 'var(--ink)' }}>{orders[0].id}</b> for{' '}
                <b style={{ color: 'var(--ink)' }}>{orders[0].customer.name}</b> — value{' '}
                <b style={{ color: 'var(--ink)' }}>
                  ₹{orders[0].payment.amount.toLocaleString('en-IN')}
                </b>.
              </>
            )}
          </div>
        </div>

        <div className="ord-modal-ft">
          <button type="button" className="ord-cta ord-cta-s" onClick={onClose}>
            Keep order{isBulk ? 's' : ''}
          </button>
          <button
            type="button"
            className="ord-cta ord-cta-p"
            onClick={onConfirm}
            style={{ background: 'var(--red)', borderColor: 'var(--red)' }}
          >
            Yes, cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
