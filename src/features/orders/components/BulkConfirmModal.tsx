import React, { useEffect } from 'react';

interface BulkConfirmModalProps {
  /** Modal title (e.g. "Ship Orders", "Print Invoice"). */
  title: string;
  /** Sub-title below the title (e.g. "Confirm bulk ship action"). */
  subtitle?: string;
  /** Number of selected rows — drives the "X order(s)" copy in the body. */
  selectedCount: number;
  /** Optional human noun (default "orders") — e.g. "shipments". */
  noun?: string;
  /** Optional body copy. Falls back to a generic 1-liner derived from
   *  `title` + selected count. */
  bodyText?: React.ReactNode;
  /** CTA label for the primary button (default "Confirm"). */
  confirmLabel?: string;
  /** Visual variant for the primary CTA. */
  variant?: 'primary' | 'danger';
  /** CTA label for the secondary close button (default "Close"). */
  closeLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Generic Bulk Confirm modal.
 *
 * Powers every fire-and-forget bulk action that doesn't need its own
 * input form (Ship Orders, Print Invoice, Book Pickup, Print Label,
 * Mark Handed Over, Download POD, etc.). The body is intentionally
 * minimal — title, sub-title, summary line and two CTAs — so this
 * single modal can stand in for ~10 different actions across all tabs.
 *
 * Uses the same `.ord-ov` + `.ord-modal-*` shell as every other modal
 * in the page so motion, spacing and the close button all look
 * identical.
 */
export const BulkConfirmModal: React.FC<BulkConfirmModalProps> = ({
  title,
  subtitle,
  selectedCount,
  noun = 'orders',
  bodyText,
  confirmLabel = 'Confirm',
  variant = 'primary',
  closeLabel = 'Close',
  onClose,
  onConfirm,
}) => {
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
      role={variant === 'danger' ? 'alertdialog' : 'dialog'}
      aria-modal="true"
      aria-labelledby="bulk-confirm-title"
    >
      <div className="ord-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ord-modal-hdr">
          <div>
            <div className="ord-modal-title" id="bulk-confirm-title">
              {title}
            </div>
            {subtitle && <div className="ord-modal-sub">{subtitle}</div>}
          </div>
          <button type="button" className="ord-modal-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="ord-modal-body">
          {bodyText ?? (
            <>
              You're about to <b>{title.toLowerCase()}</b> for{' '}
              <b style={{ color: 'var(--ink)' }}>
                {selectedCount} {noun}
                {selectedCount > 1 && !noun.endsWith('s') ? '' : ''}
              </b>
              . This will be applied to every selected row.
            </>
          )}
        </div>

        <div className="ord-modal-ft">
          <button type="button" className="ord-cta ord-cta-s" onClick={onClose}>
            {closeLabel}
          </button>
          <button
            type="button"
            className="ord-cta ord-cta-p"
            onClick={onConfirm}
            style={
              variant === 'danger'
                ? { background: 'var(--red)', borderColor: 'var(--red)' }
                : undefined
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkConfirmModal;
