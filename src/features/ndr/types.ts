/**
 * Type definitions for the NDR (Non-Delivery Report) module.
 *
 * Mirrors the data shape used by the prototype in
 * `ui-source/screens/ndr-v1.html`, normalised for use with the wider
 * XB design system (Orders / Shipments / Support reuse the same tokens).
 */

/**
 * Action priority drives:
 *  • Left-border colour on the table row (red / amber / grey).
 *  • KPI bucket the record is counted under.
 *  • The "Critical / Seller Action / No Action" pill.
 */
export type NdrPriority = 'critical' | 'seller' | 'none';

/**
 * SLA pill colour state. Mapped in `ndr.css` to `.ndr-sla-r/.ndr-sla-a/.ndr-sla-g`.
 */
export type NdrSla = 'overdue' | 'warning' | 'ok';

export type NdrPaymentMode = 'cod' | 'prepaid';
export type NdrTransportMode = 'air' | 'surface';

/**
 * Identifies who took the most recent action on the NDR row.
 * Drives the colour of the "Last Action By" cell — orange for the
 * carrier, blue when the seller has stepped in.
 */
export type NdrLastActor = 'XpressBees' | 'Seller';

/** Carrier visibility tag rendered next to "Last Action By". */
export type NdrLastTag = 'sla-breach' | 'awaiting' | 'completed';

/**
 * Single NDR record. Each record corresponds to one failed delivery
 * attempt that needs to be triaged. Optional fields capture detail
 * surfaced only inside the drawer + history timeline.
 */
export interface NdrRecord {
  id: string;
  /** Order id (e.g. "CE-1131") — also used as AWB display in this prototype */
  orderId: string;

  /** Display attempt date, e.g. "9 Apr 2026" */
  attemptDate: string;
  /** Display attempt label, e.g. "1st Attempt" */
  attemptLabel: string;
  /** Numeric attempt count (used by the timeline builder) */
  attemptCount: number;
  /** NDR reason text (drives the banner + filter) */
  reason: string;
  /** Stable reason id used by the dropdown filter */
  reasonId: string;

  /** SLA copy shown inside the SLA pill ("48h overdue" / "12h left" …) */
  slaText: string;
  sla: NdrSla;

  priority: NdrPriority;

  amountDisplay: string;
  paymentMode: NdrPaymentMode;

  customerName: string;
  customerPhone: string;
  deliveryAddress: string;

  highRtoRisk: boolean;

  transportMode: NdrTransportMode;
  serviceTier: string;
  carrier: string;

  lastActionBy: NdrLastActor;
  lastTag: NdrLastTag;
  lastActionTime: string;

  /** Sales channel (used by the channel filter) */
  channel: string;
  /** Days since the last attempt — drives the "Days since attempt" filter */
  daysSinceAttempt: number;
}

/** A simple option type reused by the inline filter chips */
export interface NdrFilterOption {
  id: string;
  label: string;
}

/** KPI bucket id surfaced by each card. */
export type NdrKpiBucket = 'all' | 'critical' | 'seller' | 'none';
