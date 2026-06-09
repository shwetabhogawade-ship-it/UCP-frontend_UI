import React, { useEffect, useRef } from 'react';

export interface RowActionsMenuProps {
  /** Anchor element's bounding rect (used to position the popover) */
  anchor: DOMRect;
  onClose: () => void;
  onPrintInvoice: () => void;
  onEditOrder: () => void;
  onAddTag: () => void;
  onCloneOrder: () => void;
  onCancelOrder: () => void;
}

const Print = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M4 2h8v4H4zM3 6h10v6h-2v2H5v-2H3zM5 10h6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Edit = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round" />
  </svg>
);
const Tag = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M2 2h6l6 6-6 6-6-6V2z" strokeLinejoin="round" />
    <circle cx="5" cy="5" r="1" />
  </svg>
);
const Clone = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="2" y="4" width="9" height="10" rx="1.5" />
    <path d="M5 4V2.5A.5.5 0 015.5 2H13a1 1 0 011 1v8.5a.5.5 0 01-.5.5H12" />
  </svg>
);
const Cancel = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="8" cy="8" r="6" />
    <path d="M5 5l6 6M11 5l-6 6" strokeLinecap="round" />
  </svg>
);

/**
 * Portal-less popover anchored to the 3-dot button. Closes on outside click
 * and on Escape. Caller owns each action handler — this component only emits.
 */
export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({
  anchor,
  onClose,
  onPrintInvoice,
  onEditOrder,
  onAddTag,
  onCloneOrder,
  onCancelOrder,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  /** Position the popover under-right of the trigger. Caps to viewport edges. */
  const MENU_WIDTH = 220;
  const top = anchor.bottom + 4;
  const left = Math.min(
    anchor.right - MENU_WIDTH,
    window.innerWidth - MENU_WIDTH - 16,
  );

  return (
    <div
      ref={ref}
      className="ord-row-menu"
      role="menu"
      style={{ top, left: Math.max(8, left), width: MENU_WIDTH }}
    >
      <button type="button" role="menuitem" className="ord-row-menu-i" onClick={onPrintInvoice}>
        {Print} Print Invoice
      </button>
      <button type="button" role="menuitem" className="ord-row-menu-i fut" onClick={onEditOrder}>
        {Edit} Edit Order
        <span className="fut-tag">Soon</span>
      </button>
      <button type="button" role="menuitem" className="ord-row-menu-i" onClick={onAddTag}>
        {Tag} Add Order Tag
      </button>
      <button type="button" role="menuitem" className="ord-row-menu-i fut" onClick={onCloneOrder}>
        {Clone} Clone Order
        <span className="fut-tag">Soon</span>
      </button>
      <div className="ord-row-menu-sep" />
      <button type="button" role="menuitem" className="ord-row-menu-i danger" onClick={onCancelOrder}>
        {Cancel} Cancel Order
      </button>
    </div>
  );
};

export default RowActionsMenu;
