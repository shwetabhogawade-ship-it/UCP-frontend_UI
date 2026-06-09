/**
 * Static NDR mock data — mirrors the prototype HTML row-for-row.
 *
 * All filter dropdowns derive their options from the constants below so
 * adding a new reason or channel automatically surfaces it in the UI.
 * When a real API replaces this file, only the loader needs to change —
 * components import from named exports here.
 */

import type {
  NdrFilterOption,
  NdrKpiBucket,
  NdrRecord,
} from '../types';

/* ──────────────────────────── Filter option sets ──────────────────────────── */

export const NDR_REASONS: NdrFilterOption[] = [
  { id: 'wa',  label: 'Wrong Address' },
  { id: 'cu',  label: 'Customer Unavailable' },
  { id: 'ref', label: 'Customer Refused' },
  { id: 'pay', label: 'Payment Dispute' },
  { id: 'ia',  label: 'Incomplete Address' },
  { id: 'oc',  label: 'Office Closed' },
  { id: 'lm',  label: 'Landmark Missing' },
];

export const NDR_ATTEMPT_BUCKETS: NdrFilterOption[] = [
  { id: '1',  label: '1 Attempt' },
  { id: '2',  label: '2 Attempts' },
  { id: '3+', label: '3 or more Attempts' },
];

export const NDR_SHIPMENT_TYPES: NdrFilterOption[] = [
  { id: 'air',     label: 'Air' },
  { id: 'surface', label: 'Surface' },
];

export const NDR_PAYMENT_MODES: NdrFilterOption[] = [
  { id: 'cod',     label: 'Cash on Delivery' },
  { id: 'prepaid', label: 'Prepaid' },
];

export const NDR_CHANNELS: NdrFilterOption[] = [
  { id: 'web', label: 'Website / Direct' },
  { id: 'amz', label: 'Amazon' },
  { id: 'fkp', label: 'Flipkart' },
  { id: 'msh', label: 'Meesho' },
  { id: 'api', label: 'API / Custom' },
  { id: 'oth', label: 'Other' },
];

export const NDR_DATE_RANGE_OPTIONS: NdrFilterOption[] = [
  { id: 'today',   label: 'Today' },
  { id: 'last7',   label: 'Last 7 days' },
  { id: 'last30',  label: 'Last 30 days' },
  { id: 'last90',  label: 'Last 90 days' },
  { id: 'custom',  label: 'Custom Range' },
];

/* ──────────────────────────── Mock records ──────────────────────────── */

/**
 * Eight NDR records mirroring the rows in `ui-source/screens/ndr-v1.html`.
 * The padding numbers used by the KPI counter (38 / 17 / 13 / 8) come from
 * the same prototype — `NDR_KPI_BASE` exposes them so the page can match
 * the screenshot exactly without inflating the mock dataset.
 */
export const NDR_RECORDS: NdrRecord[] = [
  {
    id: 'ndr-1',
    orderId: 'CE-1131',
    attemptDate: '9 Apr 2026',
    attemptLabel: '2nd Attempt',
    attemptCount: 2,
    reason: 'Wrong Address',
    reasonId: 'wa',
    slaText: '48h overdue',
    sla: 'overdue',
    priority: 'critical',
    amountDisplay: '₹1,999',
    paymentMode: 'cod',
    customerName: 'Lavanya Lakshmi',
    customerPhone: '9971137699',
    deliveryAddress:
      'Eldeco Mansions, Badhashpur Sohna Road, Gurgaon, Haryana 122017',
    highRtoRisk: true,
    transportMode: 'air',
    serviceTier: 'Express',
    carrier: 'XpressBees Air',
    lastActionBy: 'XpressBees',
    lastTag: 'awaiting',
    lastActionTime: '9 Apr, 10:30 AM',
    channel: 'web',
    daysSinceAttempt: 2,
  },
  {
    id: 'ndr-2',
    orderId: 'CE-1089',
    attemptDate: '8 Apr 2026',
    attemptLabel: '1st Attempt',
    attemptCount: 1,
    reason: 'Customer Refused (OTP Declined)',
    reasonId: 'ref',
    slaText: '36h overdue',
    sla: 'overdue',
    priority: 'critical',
    amountDisplay: '₹1,199',
    paymentMode: 'cod',
    customerName: 'Harpreet Pahwa',
    customerPhone: '9888209950',
    deliveryAddress: 'B-214, Sector 18, Rohini, New Delhi 110085',
    highRtoRisk: true,
    transportMode: 'surface',
    serviceTier: 'Standard',
    carrier: 'XpressBees Surface',
    lastActionBy: 'Seller',
    lastTag: 'sla-breach',
    lastActionTime: '8 Apr, 2:15 PM',
    channel: 'amz',
    daysSinceAttempt: 3,
  },
  {
    id: 'ndr-3',
    orderId: 'CE-1066',
    attemptDate: '8 Apr 2026',
    attemptLabel: '3rd Attempt',
    attemptCount: 3,
    reason: 'Out of Delivery Zone',
    reasonId: 'wa',
    slaText: '24h overdue',
    sla: 'overdue',
    priority: 'critical',
    amountDisplay: '₹1,199',
    paymentMode: 'cod',
    customerName: 'Priya Priyadarshini',
    customerPhone: '7045366091',
    deliveryAddress:
      'Village Bhagwanpur, Near Post Office, Muzaffarnagar, UP 251001',
    highRtoRisk: true,
    transportMode: 'surface',
    serviceTier: 'Standard',
    carrier: 'XpressBees Surface',
    lastActionBy: 'XpressBees',
    lastTag: 'awaiting',
    lastActionTime: '7 Apr, 6:45 PM',
    channel: 'fkp',
    daysSinceAttempt: 3,
  },
  {
    id: 'ndr-4',
    orderId: 'CE-1104',
    attemptDate: '9 Apr 2026',
    attemptLabel: '1st Attempt',
    attemptCount: 1,
    reason: 'Customer Unavailable',
    reasonId: 'cu',
    slaText: '12h left',
    sla: 'warning',
    priority: 'seller',
    amountDisplay: '₹2,499',
    paymentMode: 'prepaid',
    customerName: 'Rahul Sharma',
    customerPhone: '9818765432',
    deliveryAddress:
      'A-401, Oberoi Gardens, Kandivali East, Mumbai 400101',
    highRtoRisk: false,
    transportMode: 'air',
    serviceTier: 'Express',
    carrier: 'XpressBees Air',
    lastActionBy: 'XpressBees',
    lastTag: 'awaiting',
    lastActionTime: '9 Apr, 11:00 AM',
    channel: 'web',
    daysSinceAttempt: 2,
  },
  {
    id: 'ndr-5',
    orderId: 'CE-1092',
    attemptDate: '8 Apr 2026',
    attemptLabel: '2nd Attempt',
    attemptCount: 2,
    reason: 'Office Closed',
    reasonId: 'oc',
    slaText: '8h left',
    sla: 'warning',
    priority: 'seller',
    amountDisplay: '₹4,750',
    paymentMode: 'prepaid',
    customerName: 'Meera Nair',
    customerPhone: '9876543210',
    deliveryAddress:
      '3rd Floor, Prestige Tech Park, Marathahalli, Bangalore 560037',
    highRtoRisk: false,
    transportMode: 'surface',
    serviceTier: 'Standard',
    carrier: 'XpressBees Surface',
    lastActionBy: 'Seller',
    lastTag: 'sla-breach',
    lastActionTime: '8 Apr, 5:30 PM',
    channel: 'msh',
    daysSinceAttempt: 3,
  },
  {
    id: 'ndr-6',
    orderId: 'CE-1115',
    attemptDate: '9 Apr 2026',
    attemptLabel: '1st Attempt',
    attemptCount: 1,
    reason: 'Landmark Missing',
    reasonId: 'lm',
    slaText: '18h left',
    sla: 'warning',
    priority: 'seller',
    amountDisplay: '₹899',
    paymentMode: 'cod',
    customerName: 'Amit Verma',
    customerPhone: '9654321098',
    deliveryAddress:
      'Near Water Tank, Lal Bagh Area, Lucknow, UP 226001',
    highRtoRisk: false,
    transportMode: 'air',
    serviceTier: 'Express',
    carrier: 'XpressBees Air',
    lastActionBy: 'XpressBees',
    lastTag: 'awaiting',
    lastActionTime: '9 Apr, 9:15 AM',
    channel: 'api',
    daysSinceAttempt: 2,
  },
  {
    id: 'ndr-7',
    orderId: 'CE-1078',
    attemptDate: '7 Apr 2026',
    attemptLabel: '1st Attempt',
    attemptCount: 1,
    reason: 'Customer Refused — IVR Verified',
    reasonId: 'ref',
    slaText: 'Auto-retry tomorrow',
    sla: 'ok',
    priority: 'none',
    amountDisplay: '₹3,299',
    paymentMode: 'cod',
    customerName: 'Sunita Gupta',
    customerPhone: '9741234567',
    deliveryAddress:
      'H.No 45, Shivaji Nagar, Pune, Maharashtra 411005',
    highRtoRisk: false,
    transportMode: 'surface',
    serviceTier: 'Standard',
    carrier: 'XpressBees Surface',
    lastActionBy: 'XpressBees',
    lastTag: 'completed',
    lastActionTime: '8 Apr, 12:00 PM',
    channel: 'web',
    daysSinceAttempt: 4,
  },
  {
    id: 'ndr-8',
    orderId: 'CE-1055',
    attemptDate: '6 Apr 2026',
    attemptLabel: '2nd Attempt',
    attemptCount: 2,
    reason: 'Temporary Operational Delay',
    reasonId: 'wa',
    slaText: 'Courier rescheduled',
    sla: 'ok',
    priority: 'none',
    amountDisplay: '₹679',
    paymentMode: 'prepaid',
    customerName: 'Vijay Pillai',
    customerPhone: '9512345678',
    deliveryAddress:
      'Flat 7B, Emerald Apartments, Powai, Mumbai 400076',
    highRtoRisk: false,
    transportMode: 'air',
    serviceTier: 'Express',
    carrier: 'XpressBees Air',
    lastActionBy: 'Seller',
    lastTag: 'completed',
    lastActionTime: '7 Apr, 3:00 PM',
    channel: 'fkp',
    daysSinceAttempt: 5,
  },
];

/**
 * KPI bucket counts. The visible numbers (38 / 17 / 13 / 8) come straight
 * from the prototype — they include historical NDR rows not represented
 * in the eight-row mock dataset, so we expose them as constants instead
 * of computing from `NDR_RECORDS.length`.
 */
export const NDR_KPI_COUNTS: Record<NdrKpiBucket, number> = {
  all:      38,
  critical: 17,
  seller:   13,
  none:     8,
};
