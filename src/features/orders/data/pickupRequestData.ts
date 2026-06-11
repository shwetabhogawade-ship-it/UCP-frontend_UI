/**
 * Mock data + KPI helpers + filter option sets for the Pickup Request screen
 * (Orders → Pickup Request).
 *
 * Mirrors the shape used elsewhere in the Orders module:
 *   • a static dataset that drives the grid + KPI numbers
 *   • a `computePickupKpis(...)` helper for the clickable KPI strip
 *   • status option lists shared between the inline filter chip and any
 *     downstream surfaces that need to enumerate the statuses
 *
 * Numbers and labels intentionally match the supplied screenshot
 * (manifest ids 7530124–7530173, "Xpressbees …" couriers, "PrimeWarehouse" /
 * "DeluxeWarehouse2" locations) so the page lands feeling like a faithful
 * port of the reference design.
 */
import type { FilterOption } from '../types';

/* ──────────────────────────── Domain types ──────────────────────────── */

export type PickupStatus =
  | 'scheduled'
  | 'out-for-pickup'
  | 'picked'
  | 'cancelled';

export interface PickupRequest {
  /** Manifest id (mono-rendered, e.g. "7530173") */
  manifestId: string;
  /** Display date (e.g. "Jan 22, 2026") */
  createdDate: string;
  /** Display time (e.g. "02:12 AM") */
  createdTime: string;
  /** Courier service label (e.g. "Xpressbees 1 K.G") */
  courier: string;
  /** Total orders bundled in this manifest */
  ordersCount: number;
  status: PickupStatus;
  /** Pickup warehouse label */
  warehouse: string;
}

/* ──────────────────────────── Filter option sets ──────────────────────────── */

export const PICKUP_STATUSES: FilterOption[] = [
  { id: 'scheduled',      label: 'Scheduled' },
  { id: 'out-for-pickup', label: 'Out for Pick Up' },
  { id: 'picked',         label: 'Picked' },
  { id: 'cancelled',      label: 'Cancelled' },
];

/** Shipment modes surfaced in the "Shipment Mode" chip — sourced from the
 *  dataset below. Each option label matches the courier service string
 *  carried on each `PickupRequest.courier` row so equality filtering
 *  stays a single string compare. */
export const PICKUP_SHIPMENT_MODES: FilterOption[] = [
  { id: 'xpressbees-1kg',          label: 'Xpressbees 1 K.G' },
  { id: 'xpressbees-2kg',          label: 'Xpressbees 2 K.G' },
  { id: 'surface-xpressbees-05kg', label: 'Surface Xpressbees 0.5 K.G' },
];

/** Pickup locations surfaced in the "Pickup Location" chip. */
export const PICKUP_LOCATIONS: FilterOption[] = [
  { id: 'prime-warehouse',    label: 'PrimeWarehouse' },
  { id: 'deluxe-warehouse-2', label: 'DeluxeWarehouse2' },
];

/* ──────────────────────────── Status meta ────────────────────────────
 *
 * Single source of truth for the visible label + colour variant of every
 * pickup status. Mirrors `SHIPMENT_STATUS_META` so the status pill uses
 * the same `.ord-status.{green|blue|amber|red|grey}` recipe.
 */
export const PICKUP_STATUS_META: Record<
  PickupStatus,
  { label: string; variant: 'green' | 'blue' | 'amber' | 'red' | 'grey' }
> = {
  'scheduled':      { label: 'Pickup Scheduled', variant: 'blue'  },
  'out-for-pickup': { label: 'Out for Pickup',   variant: 'amber' },
  'picked':         { label: 'Picked',           variant: 'green' },
  'cancelled':      { label: 'Cancelled',        variant: 'red'   },
};

/* ──────────────────────────── Mock dataset ────────────────────────────
 *
 * Rows mirror the supplied screenshot so the page lands looking like
 * a faithful port of the reference design. Statuses are tweaked across
 * a couple of rows beyond the screenshot to exercise every KPI bucket
 * (the screenshot itself only shows "Pickup Scheduled" rows because it
 * captures the default "All" filter).
 */
export const PICKUP_REQUESTS: PickupRequest[] = [
  { manifestId: '7530173', createdDate: 'Jan 22, 2026', createdTime: '02:12 AM',
    courier: 'Xpressbees 1 K.G',          ordersCount: 15, status: 'scheduled',
    warehouse: 'PrimeWarehouse' },
  { manifestId: '7530172', createdDate: 'Jan 22, 2026', createdTime: '02:12 AM',
    courier: 'Xpressbees 2 K.G',          ordersCount: 14, status: 'scheduled',
    warehouse: 'PrimeWarehouse' },
  { manifestId: '7530171', createdDate: 'Jan 22, 2026', createdTime: '02:12 AM',
    courier: 'Surface Xpressbees 0.5 K.G', ordersCount: 50, status: 'out-for-pickup',
    warehouse: 'PrimeWarehouse' },
  { manifestId: '7530157', createdDate: 'Jan 22, 2026', createdTime: '02:02 AM',
    courier: 'Xpressbees 1 K.G',          ordersCount: 1,  status: 'scheduled',
    warehouse: 'PrimeWarehouse' },
  { manifestId: '7530155', createdDate: 'Jan 22, 2026', createdTime: '02:00 AM',
    courier: 'Xpressbees 1 K.G',          ordersCount: 1,  status: 'picked',
    warehouse: 'PrimeWarehouse' },
  { manifestId: '7530154', createdDate: 'Jan 22, 2026', createdTime: '02:00 AM',
    courier: 'Surface Xpressbees 0.5 K.G', ordersCount: 1,  status: 'out-for-pickup',
    warehouse: 'PrimeWarehouse' },
  { manifestId: '7530153', createdDate: 'Jan 22, 2026', createdTime: '02:00 AM',
    courier: 'Xpressbees 2 K.G',          ordersCount: 1,  status: 'scheduled',
    warehouse: 'DeluxeWarehouse2' },
  { manifestId: '7530152', createdDate: 'Jan 22, 2026', createdTime: '02:00 AM',
    courier: 'Xpressbees 2 K.G',          ordersCount: 1,  status: 'cancelled',
    warehouse: 'PrimeWarehouse' },
  { manifestId: '7530136', createdDate: 'Jan 22, 2026', createdTime: '01:51 AM',
    courier: 'Surface Xpressbees 0.5 K.G', ordersCount: 4,  status: 'picked',
    warehouse: 'PrimeWarehouse' },
  { manifestId: '7530124', createdDate: 'Jan 22, 2026', createdTime: '01:39 AM',
    courier: 'Xpressbees 1 K.G',          ordersCount: 1,  status: 'scheduled',
    warehouse: 'DeluxeWarehouse2' },
];

/* ──────────────────────────── KPI helpers ────────────────────────────
 *
 * Each value is derived from the dataset so adding a row reflows the
 * KPI tiles automatically. KPIs returned here are consumed by the
 * shared `ShipmentKpiStrip` (one tile per bucket).
 */
export interface PickupKpis {
  all: number;
  scheduled: number;
  outForPickup: number;
  picked: number;
  cancelled: number;
}

export function computePickupKpis(rows: PickupRequest[]): PickupKpis {
  return {
    all:          rows.length,
    scheduled:    rows.filter((r) => r.status === 'scheduled').length,
    outForPickup: rows.filter((r) => r.status === 'out-for-pickup').length,
    picked:       rows.filter((r) => r.status === 'picked').length,
    cancelled:    rows.filter((r) => r.status === 'cancelled').length,
  };
}
