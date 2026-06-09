/**
 * Static support module data, ported from
 * `ui-source/screens/support_prototype_v7b.html`.
 *
 * Kept as a single module so the visual layer is decoupled from the
 * numbers — when a real API arrives, only this file changes.
 */

import type {
  AwbRecord,
  BulkAwbRow,
  CategorySpec,
  Ticket,
  TicketStatus,
} from '../types';

/* ──────────────────────────── Categories ──────────────────────────── */

export const CATEGORIES: Record<string, CategorySpec> = {
  'Shipment Related Issues':  { desc: 'NDR, RTO, delivery, shipment requests & complaints' },
  'Pickup Related Issues':    { desc: 'Pickup delays, missed pickups, pickup complaints' },
  'Billing & Remittance':     { desc: 'COD remittance, wallet, invoices, recharge' },
  'Weight Related Issues':    { desc: 'Weight discrepancy, billing disputes' },
  'Tech Related Issues':      { desc: 'API, channel integration, order management' },
  'General Enquiry':          { desc: 'Any other question or general support need' },
};

export const RTO_SUBTYPES: string[] = [
  'RTO as per Client',
  'RTO as per 3 Attempt',
  'RTO as per Permanent NDR',
  'RTO due to High Ageing',
  'RTO due to ODA',
  'RTO due to Bulk Order / Fake Customer',
  'RTO due to Service Failure',
  'RTO due to Force Majeure',
  'RTO due to CC Validation',
  'RTO due to Wrong',
];

export const REQUEST_TYPES = [
  'RTO Cancellation Request',
  'Callback Request',
  'Update Contact Details',
  'Address Change',
] as const;

/* ──────────────────────────── AWB look-up DB ──────────────────────────── */

export const AWB_DB: Record<string, AwbRecord> = {
  '1234567890': {
    eligible: true,
    awb: '1234567890',
    courier: 'XpressBees',
    origin: 'Mumbai Hub',
    destination: 'Delhi Hub',
    weight: '1.20 kg',
    status: 'Out for Delivery',
    lastScan: '17 May 2026, 08:42 AM',
    lastLoc: 'Delhi Distribution Center',
    edd: '17 May 2026',
    slaPercent: 72,
    movements: [
      { loc: 'Mumbai Origin Hub',          time: '14 May, 10:15 AM', status: 'Picked Up',      cur: false },
      { loc: 'Mumbai Sorting Center',      time: '14 May, 06:30 PM', status: 'In Transit',     cur: false },
      { loc: 'Delhi Hub (In-Scan)',        time: '16 May, 09:18 AM', status: 'Arrived at Hub', cur: false },
      { loc: 'Delhi Distribution Center',  time: '17 May, 08:42 AM', status: 'Out for Delivery', cur: true },
    ],
  },
  '0987654321': {
    duplicate: true,
    awb: '0987654321',
    courier: 'XpressBees',
    origin: 'Pune Hub',
    destination: 'Bangalore Hub',
    weight: '0.85 kg',
    status: 'Pending Delivery Attempt',
    lastScan: '16 May 2026, 03:15 PM',
    lastLoc: 'Bangalore Distribution Center',
    edd: '17 May 2026',
    existingTicket: {
      id: 'TK-4892240',
      date: '15 May 2026',
      status: 'open',
      cat: 'Shipment, NDR & RTO',
      sub: 'Issue Over Undelivered Shipment',
      due: '19 May 2026, 10:00 AM',
      updated: '16 May 2026, 04:22 PM',
      desc: 'Delayed Delivery',
    },
  },
  '2345678901': {
    ineligible: true,
    awb: '2345678901',
    courier: 'XpressBees',
    origin: 'Chennai Hub',
    destination: 'Hyderabad Hub',
    weight: '2.10 kg',
    status: 'In Transit',
    lastScan: '17 May 2026, 07:55 AM',
    lastLoc: 'Hyderabad Sorting Facility',
    edd: '18 May 2026',
    orderDate: '16 May 2026',
    slaPercent: 45,
    slaDue: '18 May 2026, 06:00 PM',
    hoursElapsed: 21,
    slaWindowHours: 48,
    movements: [
      { loc: 'Chennai Origin Hub',         time: '16 May, 08:10 AM', status: 'Picked Up',      cur: false },
      { loc: 'Chennai Sorting Center',     time: '16 May, 02:44 PM', status: 'In Transit',     cur: false },
      { loc: 'Hyderabad Sorting Facility', time: '17 May, 07:55 AM', status: 'Arrived at Hub', cur: true  },
    ],
  },
};

/* ──────────────────────────── Tickets ──────────────────────────── */

export const INITIAL_TICKETS: Ticket[] = [
  // Open / WIP / Awaiting (10)
  { id: 'TK-4892178', date: '08 May 2026', time: '02:15 PM', awb: 'XB150487239', sub: 'Delay in Forward Delivery',                cat: 'Pickup & Delivery',         status: 'open',     due: '10 May 2026, 02:15 PM', updated: '08 May 2026, 02:15 PM', sla: 'ok' },
  { id: 'TK-4892165', date: '07 May 2026', time: '11:30 AM', awb: 'XB150487228', sub: 'Issue Over Weight Discrepancy',            cat: 'Shipment Dispute',          status: 'open',     due: '09 May 2026, 11:30 AM', updated: '08 May 2026, 09:45 AM', sla: 'ok' },
  { id: 'TK-4892140', date: '06 May 2026', time: '04:42 PM', awb: 'XB150487215', sub: 'Issue Over Undelivered Shipment',          cat: 'Shipment, NDR & RTO',       status: 'wip',      due: '08 May 2026, 04:42 PM', updated: '07 May 2026, 03:10 PM', sla: 'ok' },
  { id: 'TK-4892128', date: '05 May 2026', time: '09:18 AM', awb: 'XB150487201', sub: 'Delay in COD Remittance',                  cat: 'Finance',                   status: 'awaiting', due: '07 May 2026, 09:18 AM', updated: '06 May 2026, 11:00 AM', sla: 'ok' },
  { id: 'TK-4892112', date: '04 May 2026', time: '03:55 PM', awb: 'N/A',         sub: 'Issue with KYC Verification',              cat: 'KYC & Bank Verification',   status: 'open',     due: '06 May 2026, 03:55 PM', updated: '05 May 2026, 10:20 AM', sla: 'breach' },
  { id: 'TK-4892098', date: '03 May 2026', time: '01:21 PM', awb: 'XB150487189', sub: 'Shipment Showing as Lost/Damaged in Tracking', cat: 'Pickup & Delivery',     status: 'open',     due: '05 May 2026, 01:21 PM', updated: '04 May 2026, 08:30 AM', sla: 'breach' },
  { id: 'TK-4892085', date: '02 May 2026', time: '10:45 AM', awb: 'XB150487176', sub: 'Issue in Managing Orders',                 cat: 'Technical Support',         status: 'wip',      due: '04 May 2026, 10:45 AM', updated: '03 May 2026, 02:15 PM', sla: 'ok' },
  { id: 'TK-4892070', date: '01 May 2026', time: '08:30 AM', awb: 'XB150487160', sub: 'Delay in Pickup',                          cat: 'Pickup & Delivery',         status: 'open',     due: '03 May 2026, 08:30 AM', updated: '02 May 2026, 09:00 AM', sla: 'breach' },
  { id: 'TK-4892055', date: '30 Apr 2026', time: '02:10 PM', awb: 'XB150487148', sub: 'Request to Mark Shipment as RTO',          cat: 'Shipment, NDR & RTO',       status: 'open',     due: '02 May 2026, 02:10 PM', updated: '01 May 2026, 11:30 AM', sla: 'breach' },
  { id: 'TK-4892042', date: '29 Apr 2026', time: '09:55 AM', awb: 'N/A',         sub: 'Issue with Channel and API Integration',   cat: 'Technical Support',         status: 'wip',      due: '01 May 2026, 09:55 AM', updated: '30 Apr 2026, 03:40 PM', sla: 'ok' },

  // Resolved (5) — first two within 48h re-open window, rest expired
  { id: 'TK-4891920', date: '17 May 2026', time: '10:30 AM', awb: 'XB150487092', sub: 'Delay in Forward Delivery',                cat: 'Pickup & Delivery',         status: 'resolved', due: '19 May 2026, 10:30 AM', updated: '17 May 2026, 04:15 PM', sla: 'ok',     reopenHrsLeft: 38 },
  { id: 'TK-4891905', date: '17 May 2026', time: '03:45 PM', awb: 'XB150487079', sub: 'Delay in COD Remittance',                  cat: 'Finance',                   status: 'resolved', due: '19 May 2026, 03:45 PM', updated: '17 May 2026, 02:00 PM', sla: 'ok',     reopenHrsLeft: 11 },
  { id: 'TK-4891888', date: '14 Apr 2026', time: '11:20 AM', awb: 'N/A',         sub: 'Issue with Invoice',                       cat: 'Billing & Taxation',        status: 'resolved', due: '16 Apr 2026, 11:20 AM', updated: '15 Apr 2026, 10:45 AM', sla: 'ok',     reopenHrsLeft: 0 },
  { id: 'TK-4891870', date: '12 Apr 2026', time: '08:15 AM', awb: 'XB150487061', sub: 'Issue Over Weight Discrepancy',            cat: 'Shipment Dispute',          status: 'resolved', due: '14 Apr 2026, 08:15 AM', updated: '13 Apr 2026, 03:30 PM', sla: 'breach', reopenHrsLeft: 0 },
  { id: 'TK-4891852', date: '10 Apr 2026', time: '01:00 PM', awb: 'XB150487044', sub: 'Issue Over Undelivered Shipment',          cat: 'Shipment, NDR & RTO',       status: 'resolved', due: '12 Apr 2026, 01:00 PM', updated: '11 Apr 2026, 11:20 AM', sla: 'ok',     reopenHrsLeft: 0 },

  // Closed (6)
  { id: 'TK-4891800', date: '10 Apr 2026', time: '02:30 PM', awb: 'XB150487020', sub: 'Delay in Pickup',                          cat: 'Pickup & Delivery',         status: 'closed', due: '12 Apr 2026, 02:30 PM', updated: '11 Apr 2026, 05:00 PM', sla: 'ok' },
  { id: 'TK-4891780', date: '08 Apr 2026', time: '09:45 AM', awb: 'N/A',         sub: 'Profile Update',                           cat: 'Others',                    status: 'closed', due: '10 Apr 2026, 09:45 AM', updated: '09 Apr 2026, 01:30 PM', sla: 'ok' },
  { id: 'TK-4891762', date: '06 Apr 2026', time: '11:00 AM', awb: 'XB150487008', sub: 'Upgrade/Downgrade XpressBees Plan',        cat: 'Finance',                   status: 'closed', due: '08 Apr 2026, 11:00 AM', updated: '07 Apr 2026, 04:22 PM', sla: 'ok' },
  { id: 'TK-4891745', date: '04 Apr 2026', time: '03:20 PM', awb: 'XB150486996', sub: 'Issue with KYC Verification',              cat: 'KYC & Bank Verification',   status: 'closed', due: '06 Apr 2026, 03:20 PM', updated: '05 Apr 2026, 02:15 PM', sla: 'ok' },
  { id: 'TK-4891728', date: '02 Apr 2026', time: '08:00 AM', awb: 'XB150486982', sub: 'Amount Not Received for Lost Shipment',    cat: 'Claims',                    status: 'closed', due: '04 Apr 2026, 08:00 AM', updated: '03 Apr 2026, 09:30 AM', sla: 'breach' },
  { id: 'TK-4891710', date: '31 Mar 2026', time: '05:15 PM', awb: 'XB150486970', sub: 'Issue in Recharging Wallet',               cat: 'Finance',                   status: 'closed', due: '02 Apr 2026, 05:15 PM', updated: '01 Apr 2026, 11:00 AM', sla: 'ok' },
];

/* ──────────────────────────── Bulk AWBs ──────────────────────────── */

export const BULK_AWB_DATA: BulkAwbRow[] = [
  { order: '25JULBU030', awb: '5828010049066', origin: 'KUKATPALLY (Ecil - 500062)',     dest: 'PRAVAN (KURNOOL - 518002)',  lastUpdate: '17 May, Today',     lastScan: 'Manifest uploaded at Hyderabad_Bownplly_C',          status: 'created',       tkId: 'TK-4892305' },
  { order: '25JULBU031', awb: '5828010049067', origin: 'HITECH CITY (500081)',           dest: 'VIZAG (530002)',             lastUpdate: '17 May, Today',     lastScan: 'In transit at Vijayawada Hub',                       status: 'created',       tkId: 'TK-4892306' },
  { order: '25JULBU032', awb: '5828010049068', origin: 'SECUNDERABAD (500003)',          dest: 'PUNE (411001)',              lastUpdate: '16 May, Yesterday', lastScan: 'Arrived at Pune Distribution',                       status: 'created',       tkId: 'TK-4892307' },
  { order: '25JULBU033', awb: '5828010049069', origin: 'BEGUMPET (500016)',              dest: 'CHENNAI (600001)',           lastUpdate: '16 May, Yesterday', lastScan: 'Out for delivery Chennai',                           status: 'created',       tkId: 'TK-4892308' },
  { order: '25JULBU034', awb: '5828010049070', origin: 'GACHIBOWLI (500032)',            dest: 'BANGALORE (560001)',         lastUpdate: '17 May, Today',     lastScan: 'Shipment picked up',                                 status: 'not_eligible',  reason: 'SLA not breached — 26 hrs remaining' },
  { order: '25JULBU035', awb: '5828010049071', origin: 'MADHAPUR (500081)',              dest: 'DELHI (110001)',             lastUpdate: '15 May',            lastScan: 'In transit Nagpur Hub',                              status: 'exists',        existingId: 'TK-4891540' },
  { order: '25JULBU036', awb: '5828010049072', origin: 'KONDAPUR (500084)',              dest: 'MUMBAI (400001)',            lastUpdate: '15 May',            lastScan: 'Delivery attempt failed',                            status: 'exists',        existingId: 'TK-4891541' },
  { order: '25JULBU037', awb: '5828010049073', origin: 'JUBILEE HILLS (500033)',         dest: 'KOLKATA (700001)',           lastUpdate: '17 May, Today',     lastScan: 'Manifest uploaded',                                  status: 'created',       tkId: 'TK-4892309' },
  { order: '25JULBU038', awb: '5828010049074', origin: 'AMEERPET (500016)',              dest: 'JAIPUR (302001)',            lastUpdate: '16 May',            lastScan: 'Reached Jaipur Hub',                                 status: 'created',       tkId: 'TK-4892310' },
  { order: '25JULBU039', awb: '5828010049075', origin: 'BANJARA HILLS (500034)',         dest: 'AHMEDABAD (380001)',         lastUpdate: '17 May, Today',     lastScan: 'Picked up at origin',                                status: 'not_eligible',  reason: 'SLA not breached — 18 hrs remaining' },
];

/* ──────────────────────────── Pincode autofill ──────────────────────────── */

export const PINCODE_MAP: Record<string, [string, string]> = {
  '400001': ['Mumbai',         'Maharashtra'],
  '110001': ['New Delhi',      'Delhi'],
  '560001': ['Bengaluru',      'Karnataka'],
  '500001': ['Hyderabad',      'Telangana'],
  '600001': ['Chennai',        'Tamil Nadu'],
  '411001': ['Pune',           'Maharashtra'],
  '380001': ['Ahmedabad',      'Gujarat'],
  '700001': ['Kolkata',        'West Bengal'],
  '302001': ['Jaipur',         'Rajasthan'],
  '530001': ['Visakhapatnam',  'Andhra Pradesh'],
};

/* ──────────────────────────── Display helpers ──────────────────────────── */

export const STATUS_LABEL: Record<TicketStatus, { label: string; cls: string }> = {
  open:     { label: 'OPEN',         cls: 'st-open' },
  wip:      { label: 'IN PROGRESS',  cls: 'st-wip' },
  awaiting: { label: 'AWAITING',     cls: 'st-awaiting' },
  resolved: { label: 'RESOLVED',     cls: 'st-resolved' },
  closed:   { label: 'CLOSED',       cls: 'st-closed' },
};

export const FILTER_STATUSES: { id: TicketStatus; label: string }[] = [
  { id: 'open',     label: 'Open' },
  { id: 'wip',      label: 'In Progress' },
  { id: 'awaiting', label: 'Awaiting' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'closed',   label: 'Closed' },
];
