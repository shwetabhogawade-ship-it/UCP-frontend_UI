/**
 * Static dashboard mock data, ported 1:1 from
 * `ui-source/screens/dashboard (3).html`.
 *
 * Kept as a single module so the visual layer is decoupled from the
 * numbers — when the real API arrives, only this file changes.
 */

export type Severity = 'high' | 'med' | 'low' | 'neutral';

export interface KpiSpec {
  lbl: string;
  n: string;
  sub?: string;
  sev: Severity;
  cta?: string;
  tip?: string;
}

/* ───────────────────── Top KPI row ───────────────────── */
export const TOP_KPIS: KpiSpec[] = [
  { lbl: 'Pending Shipment',              n: '142',  sub: '₹1.2L awaiting dispatch',          sev: 'med',  cta: 'Ship Now',  tip: 'Orders ready to ship' },
  { lbl: 'Pending Pickup',                n: '36',   sub: '2 pickups scheduled today',        sev: 'med',  cta: 'Book Now',  tip: 'Manifested but not picked up' },
  { lbl: 'Critical NDR Action Required',  n: '28',   sub: '₹2.4L at RTO risk',                sev: 'high', cta: 'Resolve',   tip: 'Non-delivery reports needing action' },
  { lbl: 'Weight Dispute',                n: '8',    sub: '₹3.2K in penalties',               sev: 'low',  cta: 'Resolve',   tip: 'Courier weight mismatch' },
];

/* ───────────────────── ORDERS & SHIPMENTS ───────────────────── */

export interface PickupRow {
  id: string;
  d: string;
  o: number;
  loc: string;
  st: 'today' | 'overdue' | 'upcoming';
}

export const PICKUPS: PickupRow[] = [
  { id: 'MAN-8821', d: 'Today',  o: 24, loc: 'Warehouse A, Delhi',     st: 'today' },
  { id: 'MAN-8820', d: 'Today',  o: 12, loc: 'Warehouse B, Mumbai',    st: 'overdue' },
  { id: 'MAN-8819', d: '28 Apr', o: 38, loc: 'Warehouse A, Delhi',     st: 'upcoming' },
  { id: 'MAN-8818', d: '29 Apr', o: 15, loc: 'Warehouse C, Bangalore', st: 'upcoming' },
];

export const PICKUP_BADGE: Record<PickupRow['st'], { label: string; cls: string }> = {
  today:    { label: 'Today',    cls: 'bg-amber' },
  overdue:  { label: 'Overdue',  cls: 'bg-red' },
  upcoming: { label: 'Upcoming', cls: 'bg-gray' },
};

/* Net Revenue waterfall */
export const NET_REVENUE = {
  del:  1168350,
  rto:  54200,
  ship: 42800,
  pen:  8600,
};

/* Shipment pipeline */
export const SHIPMENTS = {
  total: 1320,
  delivered: 856,
  transit:   318,
  failed:    146,
};

/* Categories & products */
export interface CategoryRow { n: string; o: number; r: number; c: string; }
export const CATEGORIES: CategoryRow[] = [
  { n: 'Ethnic Wear',   o: 412, r: 286000, c: 'var(--c-insta)' },
  { n: 'Accessories',   o: 324, r: 198000, c: 'var(--c-amz)'   },
  { n: 'Footwear',      o: 196, r: 152400, c: 'var(--c-cod)'   },
  { n: 'Electronics',   o: 148, r: 124000, c: 'var(--c-transit)' },
  { n: 'Home & Living', o: 86,  r: 64000,  c: 'var(--c-ontime)' },
];
export const CATEGORIES_TOTAL_REV = 824400;

export interface ProductRow { n: string; o: number; r: number; }
export const PRODUCTS: ProductRow[] = [
  { n: 'Cotton Kurti Set', o: 168, r: 142000 },
  { n: 'Leather Wallet',   o: 224, r: 98400  },
  { n: 'Silk Saree',       o: 42,  r: 87600  },
  { n: 'Running Shoes',    o: 96,  r: 76200  },
  { n: 'Phone Case',       o: 432, r: 64800  },
  { n: 'Silver Earrings',  o: 86,  r: 58200  },
  { n: 'Gym T-Shirt',      o: 124, r: 52400  },
  { n: 'Laptop Sleeve',    o: 68,  r: 48600  },
];

/* Locations & customers */
export interface LocationRow { s: string; o: number; r: number; p: number; }
export const LOCATIONS: LocationRow[] = [
  { s: 'Uttar Pradesh',   o: 248, r: 41000, p: 45.91 },
  { s: 'Gujarat',         o: 184, r: 15200, p: 17.02 },
  { s: 'Madhya Pradesh',  o: 142, r: 11100, p: 12.43 },
  { s: 'Maharashtra',     o: 118, r: 5400,  p: 6.05  },
  { s: 'Assam',           o: 64,  r: 2900,  p: 3.25  },
  { s: 'Rajasthan',       o: 52,  r: 2400,  p: 2.69  },
];

export interface CustomerRow { n: string; o: number; r: number; }
export const CUSTOMERS: CustomerRow[] = [
  { n: 'Priya Sharma',   o: 12, r: 24800 },
  { n: 'Rajesh Kumar',   o: 8,  r: 18600 },
  { n: 'Anita Patel',    o: 6,  r: 16200 },
  { n: 'Mohammed Ali',   o: 9,  r: 14400 },
  { n: 'Sneha Reddy',    o: 5,  r: 12800 },
  { n: 'Vikram Singh',   o: 7,  r: 11200 },
  { n: 'Kavitha N.',     o: 4,  r: 10600 },
  { n: 'Arjun Mehta',    o: 6,  r: 9800  },
];

/* ───────────────────── NDR ───────────────────── */
export const NDR_KPIS: KpiSpec[] = [
  { lbl: 'Action Required', n: '17',     sev: 'high'    },
  { lbl: 'NDR Raised',      n: '28',     sev: 'neutral' },
  { lbl: 'Delivered',       n: '6',      sev: 'neutral' },
  { lbl: 'Post NDR',        n: '14',     sev: 'neutral' },
  { lbl: 'NDR Raised %',    n: '27.78%', sev: 'neutral' },
];

export interface NdrReasonRow { l: string; v: number; c: string; }
export const NDR_REASONS: NdrReasonRow[] = [
  { l: 'Customer Refused',  v: 8, c: 'var(--c-insta)'    },
  { l: 'Wrong Address',     v: 6, c: 'var(--c-lost)'     },
  { l: 'Unavailable',       v: 5, c: 'var(--c-transit)'  },
  { l: 'Payment Dispute',   v: 4, c: 'var(--c-prepaid)'  },
  { l: 'Office Closed',     v: 3, c: 'var(--c-cod)'      },
  { l: 'Landmark Missing',  v: 2, c: 'var(--c-delivered)' },
];
export const NDR_TOTAL = 28;

/* NDR funnel */
export const NDR_FUNNEL = [
  { hdr: '1st NDR', total: 16, pending: 8, delivered: 4 },
  { hdr: '2nd NDR', total: 8,  pending: 3, delivered: 2 },
  { hdr: '3rd NDR', total: 4,  pending: 2, delivered: 0 },
];

/* NDR Response funnels */
export const NDR_RESPONSE = {
  seller: { responded: 8, positive: 5, delivered: 4 },
  buyer:  { responded: 5, positive: 3, delivered: 2 },
};

/* NDR vs reattempt heatmap (Mon → Sun + Total) */
export type CellTone = 'good' | 'warn' | 'bad' | 'neutral';

export const NDR_ATTEMPT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const NDR_ATTEMPT_TABLE: { label: string; cells: (number | string)[]; tones: CellTone[] }[] = [
  { label: 'NDR Raised',  cells: [2, 4, 5, 3, 6, 4, 4, 28],
    tones: ['neutral','neutral','neutral','neutral','neutral','neutral','neutral','neutral'] },
  { label: 'Reattempted', cells: [2, 3, 4, 3, 5, 4, 2, 23],
    tones: ['good','warn','warn','good','warn','good','bad','warn'] },
  { label: 'Gap',         cells: ['✓','-1','-1','✓','-1','✓','-2','-5'],
    tones: ['good','bad','bad','good','bad','good','bad','warn'] },
];

/* NDR Status weekly grouped bars */
export interface NdrStatusWeek { l: string; del: number; rto: number; pend: number; lost: number; }
export const NDR_STATUS: NdrStatusWeek[] = [
  { l: '05-11 May',     del: 1, rto: 0, pend: 0, lost: 0 },
  { l: '12-18 May',     del: 1, rto: 2, pend: 1, lost: 0 },
  { l: '19-25 May',     del: 2, rto: 2, pend: 1, lost: 0 },
  { l: '26 May-01 Jun', del: 1, rto: 0, pend: 1, lost: 1 },
  { l: '02-03 Jun',     del: 0, rto: 1, pend: 0, lost: 0 },
];
export const NDR_STATUS_MAX = 5;

/* Seller / Buyer response heatmaps */
export const SELLER_RESPONSE: { label: string; cells: number[]; tones: CellTone[] }[] = [
  { label: 'NDR',        cells: [2, 4, 5, 3, 6, 4, 4],
    tones: ['neutral','neutral','neutral','neutral','neutral','neutral','neutral'] },
  { label: 'Response',   cells: [2, 3, 4, 2, 5, 3, 3],
    tones: ['good','warn','warn','warn','warn','warn','warn'] },
  { label: '+ve Action', cells: [1, 2, 3, 1, 4, 2, 2],
    tones: ['warn','warn','good','bad','warn','warn','warn'] },
];

export const BUYER_RESPONSE: { label: string; cells: number[]; tones: CellTone[] }[] = [
  { label: 'NDR',        cells: [2, 4, 5, 3, 6, 4, 4],
    tones: ['neutral','neutral','neutral','neutral','neutral','neutral','neutral'] },
  { label: 'Response',   cells: [1, 2, 2, 1, 3, 2, 1],
    tones: ['warn','warn','warn','bad','warn','warn','bad'] },
  { label: '+ve Action', cells: [0, 1, 2, 0, 2, 1, 1],
    tones: ['bad','warn','good','bad','warn','warn','warn'] },
];

/* ───────────────────── RTO ───────────────────── */
export const RTO_TOTAL = 64;
export const RTO_RATE  = '4.6%';
export const RTO_LOSS  = '₹54.2K';

export const RTO_REASONS: NdrReasonRow[] = [
  { l: 'COD Refusal',        v: 28, c: 'var(--c-cod)'     },
  { l: 'Address Issue',      v: 16, c: 'var(--c-lost)'    },
  { l: 'Unavailable',        v: 12, c: 'var(--c-transit)' },
  { l: 'Refused After Open', v: 8,  c: 'var(--c-insta)'   },
];

/* Top RTO pincodes */
export interface PincodeRow { pin: string; city: string; rto: number; reason: string; }
export const RTO_PINCODES: PincodeRow[] = [
  { pin: '700001', city: 'Kolkata',   rto: 18, reason: 'COD Refusal'  },
  { pin: '400601', city: 'Thane',     rto: 15, reason: 'Address Issue' },
  { pin: '110085', city: 'Delhi',     rto: 12, reason: 'COD Refusal'  },
  { pin: '560034', city: 'Bangalore', rto: 11, reason: 'Not Available' },
  { pin: '600028', city: 'Chennai',   rto: 9,  reason: 'COD Refusal'  },
  { pin: '380015', city: 'Ahmedabad', rto: 8,  reason: 'Address Issue' },
];

/* RTO Trend */
export interface RtoTrendRow { l: string; v: number; }
export const RTO_TREND: RtoTrendRow[] = [
  { l: 'Jan', v: 32 },
  { l: 'Feb', v: 28 },
  { l: 'Mar', v: 44 },
  { l: 'Apr', v: 52 },
  { l: 'May', v: 64 },
];
export const RTO_TREND_MAX = 64;

/* RTO Status monthly grouped bars */
export interface RtoStatusMonth { l: string; init: number; del: number; undel: number; }
export const RTO_STATUS: RtoStatusMonth[] = [
  { l: 'Mar', init: 0, del: 14, undel: 0 },
  { l: 'Apr', init: 0, del: 18, undel: 0 },
  { l: 'May', init: 8, del: 12, undel: 2 },
];
export const RTO_STATUS_MAX = 22;
