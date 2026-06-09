import React, { useEffect, useRef, useState } from 'react';
import NdrHistoryTimeline from './NdrHistoryTimeline';
import type { NdrRecord } from '../types';

interface NdrTableProps {
  records: NdrRecord[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  onOrderClick: (record: NdrRecord) => void;
  onReattempt: (record: NdrRecord) => void;
  onUpdateDetails: (record: NdrRecord) => void;
  onHold: (record: NdrRecord) => void;
  onRto: (record: NdrRecord) => void;
  onViewDetails: (record: NdrRecord) => void;
}

const PRIORITY_ROW_CLS: Record<NdrRecord['priority'], string> = {
  critical: 'ndr-pc',
  seller:   'ndr-ps',
  none:     'ndr-pn',
};
const PRIORITY_LABEL: Record<NdrRecord['priority'], string> = {
  critical: 'Critical',
  seller:   'Seller Action',
  none:     'No Action',
};

const ChevronDownIcon = (
  <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M1 1l4 4 4-4" strokeLinecap="round" />
  </svg>
);
const ChevronUpIcon = (
  <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M1 5l4-4 4 4" strokeLinecap="round" />
  </svg>
);
const RtoIcon = (
  <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M5 1L1 9h8L5 1z" />
    <path d="M5 4v2M5 7h.01" strokeLinecap="round" />
  </svg>
);

const COLUMNS = [
  'Delivery Attempt Details',
  'Order Details',
  'Customer Details',
  'Delivery Address',
  'Shipment Details',
  'Last Action By',
  'Action',
];

/**
 * NDR records table. Re-uses the shared `.ord-tbl` recipe + adds the
 * NDR-specific row decorations (priority left-border, pulsing SLA dot,
 * RTO risk pill, action dropdown). One row may be expanded at a time
 * to reveal the history timeline directly below it.
 */
export const NdrTable: React.FC<NdrTableProps> = ({
  records,
  selected,
  onToggleSelect,
  onToggleSelectAll,
  expandedId,
  onToggleExpand,
  onOrderClick,
  onReattempt,
  onUpdateDetails,
  onHold,
  onRto,
  onViewDetails,
}) => {
  const [openActionsFor, setOpenActionsFor] = useState<string | null>(null);
  const actionsRootRef = useRef<HTMLDivElement>(null);

  /* Close the per-row Actions menu on any outside click. */
  useEffect(() => {
    if (!openActionsFor) return;
    const onDoc = (e: MouseEvent) => {
      if (
        actionsRootRef.current &&
        !actionsRootRef.current.contains(e.target as Node)
      ) {
        setOpenActionsFor(null);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openActionsFor]);

  const allSelected = records.length > 0 && records.every((r) => selected.has(r.id));
  const partialSelected = !allSelected && records.some((r) => selected.has(r.id));
  const headerCheckboxClass = `ord-cb ${
    allSelected ? 'on' : partialSelected ? 'partial' : ''
  }`;

  return (
    <div className="ord-grid" ref={actionsRootRef}>
      <div className="ord-grid-scroll">
        <table className="ord-tbl">
          <thead>
            <tr>
              <th className="ord-col-cb">
                <button
                  type="button"
                  className={headerCheckboxClass}
                  onClick={onToggleSelectAll}
                  aria-label={
                    allSelected ? 'Deselect all NDR rows' : 'Select all NDR rows on this page'
                  }
                />
              </th>
              {COLUMNS.map((label) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => {
              const isSelected = selected.has(r.id);
              const isExpanded = expandedId === r.id;
              const actionsOpen = openActionsFor === r.id;
              return (
                <React.Fragment key={r.id}>
                  <tr
                    className={`ndr-row ${PRIORITY_ROW_CLS[r.priority]} ${
                      isExpanded ? 'has-exp' : ''
                    } ${isSelected ? 'selected' : ''}`}
                  >
                    <td className="ord-col-cb">
                      <div className="tdi">
                        <button
                          type="button"
                          className={`ord-cb ${isSelected ? 'on' : ''}`}
                          onClick={() => onToggleSelect(r.id)}
                          aria-label={
                            isSelected ? `Deselect ${r.orderId}` : `Select ${r.orderId}`
                          }
                        />
                      </div>
                    </td>

                    {/* Delivery Attempt Details */}
                    <td>
                      <div className="tdi">
                        <div className="ndr-att-d">{r.attemptDate}</div>
                        <div className="ndr-att-n">{r.attemptLabel}</div>
                        <div className="ndr-att-r">{r.reason}</div>
                        <div className={`ndr-sla-t ${r.sla}`}>
                          <span className="ndr-sla-dot" aria-hidden="true" />
                          {r.slaText}
                        </div>
                        <div className={`ndr-pri-pill ${r.priority}`}>
                          <span className={`ndr-pri-dot ${r.priority}`} />
                          {PRIORITY_LABEL[r.priority]}
                        </div>
                      </div>
                    </td>

                    {/* Order Details */}
                    <td>
                      <div className="tdi">
                        <button
                          type="button"
                          className="ndr-oid"
                          onClick={() => onOrderClick(r)}
                        >
                          {r.orderId}
                        </button>
                        <div className="ndr-oamt">{r.amountDisplay}</div>
                        <span className={`ndr-pay-pill ${r.paymentMode}`}>
                          {r.paymentMode === 'cod' ? 'COD' : 'Prepaid'}
                        </span>
                      </div>
                    </td>

                    {/* Customer Details */}
                    <td>
                      <div className="tdi">
                        <div className="ndr-cust-name">{r.customerName}</div>
                        <div className="ndr-cust-phone">{r.customerPhone}</div>
                      </div>
                    </td>

                    {/* Delivery Address */}
                    <td>
                      <div className="tdi">
                        <div className="ndr-addr">{r.deliveryAddress}</div>
                        {r.highRtoRisk && (
                          <div className="ndr-rto-pill">
                            {RtoIcon}
                            High RTO Risk
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Shipment Details */}
                    <td>
                      <div className="tdi">
                        <span className={`ndr-mode-pill ${r.transportMode}`}>
                          {r.transportMode === 'air' ? '✈ Air' : '◼ Surface'}
                        </span>
                        <div className="ndr-ship-carrier">{r.carrier}</div>
                        <div className="ndr-ship-tier">{r.serviceTier}</div>
                      </div>
                    </td>

                    {/* Last Action By */}
                    <td>
                      <div className="tdi">
                        <div
                          className={`ndr-last-by ${
                            r.lastActionBy === 'Seller' ? 'seller' : 'xb'
                          }`}
                        >
                          {r.lastActionBy}
                        </div>
                        <div className="ndr-last-time">{r.lastActionTime}</div>
                        <button
                          type="button"
                          className="ndr-hist-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleExpand(r.id);
                          }}
                        >
                          {isExpanded ? (
                            <>Hide History {ChevronUpIcon}</>
                          ) : (
                            <>View History {ChevronDownIcon}</>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Action */}
                    <td>
                      <div className="tdi">
                        {r.priority === 'none' ? (
                          <div className="ndr-act-cell">
                            <button
                              type="button"
                              className="ndr-ab ghost"
                              onClick={() => onViewDetails(r)}
                            >
                              View Details
                            </button>
                          </div>
                        ) : (
                          <div className="ndr-act-cell">
                            <button
                              type="button"
                              className="ndr-ab primary"
                              onClick={() => onReattempt(r)}
                            >
                              Re-attempt
                            </button>
                            <div className={`ndr-adw ${actionsOpen ? 'open' : ''}`}>
                              <button
                                type="button"
                                className="ndr-ab actions"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionsFor(actionsOpen ? null : r.id);
                                }}
                                aria-haspopup="menu"
                                aria-expanded={actionsOpen}
                              >
                                Actions {ChevronDownIcon}
                              </button>
                              {actionsOpen && (
                                <div className="ndr-adm" role="menu">
                                  <button
                                    type="button"
                                    className="ndr-adm-i"
                                    onClick={() => {
                                      setOpenActionsFor(null);
                                      onUpdateDetails(r);
                                    }}
                                    role="menuitem"
                                  >
                                    Update Details
                                  </button>
                                  <button
                                    type="button"
                                    className="ndr-adm-i"
                                    onClick={() => {
                                      setOpenActionsFor(null);
                                      onHold(r);
                                    }}
                                    role="menuitem"
                                  >
                                    Hold for 48 hrs
                                  </button>
                                  <button
                                    type="button"
                                    className="ndr-adm-i danger"
                                    onClick={() => {
                                      setOpenActionsFor(null);
                                      onRto(r);
                                    }}
                                    role="menuitem"
                                  >
                                    RTO
                                  </button>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              className="ndr-ab ghost"
                              onClick={() => onViewDetails(r)}
                            >
                              View Details
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="ndr-exp-row">
                      <td colSpan={COLUMNS.length + 1}>
                        <div className="ndr-exp-panel">
                          <div className="ndr-exp-top">
                            <button
                              type="button"
                              className="ndr-exp-hide"
                              onClick={() => onToggleExpand(r.id)}
                            >
                              Hide History {ChevronUpIcon}
                            </button>
                          </div>
                          <NdrHistoryTimeline record={r} />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="ord-foot">
        <span>
          Showing <b>1 – {records.length}</b> of <b>38</b>
        </span>
        <div className="ord-foot-pgw">
          <button type="button" className="ord-foot-pgb icon" disabled>
            ← Previous
          </button>
          <button type="button" className="ord-foot-pgb on">
            1
          </button>
          <button type="button" className="ord-foot-pgb">
            2
          </button>
          <button type="button" className="ord-foot-pgb">
            3
          </button>
          <button type="button" className="ord-foot-pgb icon">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default NdrTable;
