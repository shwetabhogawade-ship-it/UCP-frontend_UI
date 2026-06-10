import React, { useEffect, useState } from 'react';

export type BulkPaymentMode = 'PREPAID' | 'COD';

interface BulkPaymentModeModalProps {
  selectedCount: number;
  onClose: () => void;
  onConfirm: (mode: BulkPaymentMode) => void;
}

/**
 * Bulk Payment Mode modal.
 *
 * Lets the user reassign the payment mode for many orders in a single
 * pass. Uses the same `.ord-nf-toggle` PREPAID/COD widget that powers
 * the Payment Details card on the New Order Creation screen so the
 * mental model is identical across create + bulk-edit surfaces.
 */
export const BulkPaymentModeModal: React.FC<BulkPaymentModeModalProps> = ({
  selectedCount,
  onClose,
  onConfirm,
}) => {
  const [mode, setMode] = useState<BulkPaymentMode>('COD');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="ord-ov"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bulk-pay-title"
    >
      <div
        className="ord-modal"
        style={{ width: 480 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ord-modal-hdr">
          <div>
            <div className="ord-modal-title" id="bulk-pay-title">
              Update Payment Mode
            </div>
            <div className="ord-modal-sub">
              Bulk Payment Mode Update · {selectedCount} order{selectedCount > 1 ? 's' : ''} selected
            </div>
          </div>
          <button type="button" className="ord-modal-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="ord-modal-body">
          <div className="sup-mf" style={{ marginBottom: 0 }}>
            <div className="sup-ml">Payment Mode</div>
            <div className="ord-nf-toggle">
              <button
                type="button"
                className={mode === 'PREPAID' ? 'on' : ''}
                onClick={() => setMode('PREPAID')}
              >
                PREPAID
              </button>
              <button
                type="button"
                className={mode === 'COD' ? 'on' : ''}
                onClick={() => setMode('COD')}
              >
                COD
              </button>
            </div>
          </div>

          {mode === 'COD' && (
            <div className="ord-modal-note">
              Collectable amount will be auto-derived from each order's total
              once the mode is updated.
            </div>
          )}
        </div>

        <div className="ord-modal-ft">
          <button type="button" className="ord-cta ord-cta-s" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="ord-cta ord-cta-p"
            onClick={() => onConfirm(mode)}
          >
            Update Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkPaymentModeModal;
