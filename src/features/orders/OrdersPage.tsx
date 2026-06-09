import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../../components/ui/Toast';
import { useReportsStore } from '../../store/useReportsStore';
import OrdersFilterBar, {
  initialPendingFilters,
  type OrdersFilterState,
} from './components/OrdersFilterBar';
import MoreFiltersDrawer from './components/MoreFiltersDrawer';
import PendingKpiStrip, { type KpiBucket } from './components/PendingKpiStrip';
import ShipmentKpiStrip, {
  type KpiCardSpec,
} from './components/ShipmentKpiStrip';
import BulkActionsDropdown from './components/BulkActionsDropdown';
import OrdersGrid, { type SortState } from './components/OrdersGrid';
import ShipmentsGrid, {
  type ShipmentSortState,
} from './components/ShipmentsGrid';
import AddTagModal from './components/AddTagModal';
import CancelOrderModal from './components/CancelOrderModal';
import OrderDetailsDrawer from './components/OrderDetailsDrawer';
import {
  BULK_ACTIONS,
  DEFAULT_TAGS,
  PENDING_ORDERS,
  computePendingKpis,
} from './data/ordersData';
import {
  ALL_SHIPMENTS,
  DELIVERED_SHIPMENTS,
  IN_TRANSIT_SHIPMENTS,
  READY_TO_PICKUP_SHIPMENTS,
  READY_TO_SHIP_SHIPMENTS,
  RTO_SHIPMENTS,
  computeAllShipmentKpis,
  computeDeliveredKpis,
  computeInTransitKpis,
  computeReadyToPickupKpis,
  computeReadyToShipKpis,
  computeRtoKpis,
  fmtRupees,
} from './data/shipmentsData';
import type { BulkAction } from './data/ordersData';
import type { Order, OrderTabId, Shipment } from './types';

interface TabSpec {
  id: OrderTabId;
  label: string;
}

const TABS: TabSpec[] = [
  { id: 'pending',         label: 'Pending' },
  { id: 'ready-to-ship',   label: 'Ready to Ship' },
  { id: 'ready-to-pickup', label: 'Ready to Pickup' },
  { id: 'in-transit',      label: 'In Transit' },
  { id: 'delivered',       label: 'Delivered' },
  { id: 'rto',             label: 'RTO' },
  { id: 'all',             label: 'All' },
];

/* Icons used in the actions group (download / bulk upload glyphs) */
const DownloadIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M8 2v9M4.5 7.5L8 11l3.5-3.5M2.5 13.5h11" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const BulkUpdateIcon = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="2" y="3" width="12" height="2.5" rx=".7" />
    <rect x="2" y="7" width="12" height="2.5" rx=".7" />
    <rect x="2" y="11" width="7" height="2.5" rx=".7" />
  </svg>
);

/** Static per-shipment-tab dataset lookup. */
const SHIPMENT_DATA: Record<Exclude<OrderTabId, 'pending'>, Shipment[]> = {
  'ready-to-ship':   READY_TO_SHIP_SHIPMENTS,
  'ready-to-pickup': READY_TO_PICKUP_SHIPMENTS,
  'in-transit':      IN_TRANSIT_SHIPMENTS,
  delivered:         DELIVERED_SHIPMENTS,
  rto:               RTO_SHIPMENTS,
  all:               ALL_SHIPMENTS,
};

/**
 * Top-level Orders page. Owns:
 *
 *  • Tab state (Pending tab + every Shipment lifecycle tab)
 *  • KPI bucket state (drives filtering when a KPI card is clicked)
 *  • Filter state (mirrored on the inline chips + the "All Filters" drawer)
 *  • Order list + selection + sort state for both grids
 *  • Modals: Add Tag, Cancel Order (single + bulk variants)
 *  • Toast notifications via the shared `useReportsStore`
 *
 * Layout (every tab):
 *
 *   Title + CTAs
 *   KPI cards
 *   Tabs
 *   [ Filter bar (auto width) ............ Bulk Upload · Download · Bulk Action ]
 *   Grid
 */
export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const showToast = useReportsStore((s) => s.showToast);
  const toast = useReportsStore((s) => s.toast);

  /* ─── Tab + filter state ─────────────────────────────────── */
  const [activeTab, setActiveTab] = useState<OrderTabId>('pending');
  const [filters, setFilters] = useState<OrdersFilterState>(initialPendingFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* ─── Active KPI bucket per tab ────────────────────────────
     One bucket map keyed by tab id keeps every tab's KPI filter
     independent — switching tabs preserves the previous selection. */
  const [pendingBucket, setPendingBucket] = useState<KpiBucket>('all');
  const [shipmentBucket, setShipmentBucket] = useState<string>('all');

  /* ─── Orders + Shipment selection + sort ─────────────────── */
  const [orders, setOrders] = useState<Order[]>(PENDING_ORDERS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  /* `null` = default unsorted state — header arrows are hidden. */
  const [pendingSort, setPendingSort] = useState<SortState | null>(null);
  const [shipmentSort, setShipmentSort] = useState<ShipmentSortState | null>(null);

  /* ─── Tag library — accumulates new tags as users create them ── */
  const [tagPool, setTagPool] = useState<string[]>(DEFAULT_TAGS);

  /* ─── Modal state ────────────────────────────────────────── */
  const [addTagFor, setAddTagFor] = useState<Order | Shipment | null>(null);
  const [cancelFor, setCancelFor] = useState<(Order | Shipment)[] | null>(null);
  /* Read-only Order Details drawer — only opened from the All Orders tab
     when a user clicks the "View Details" hyperlink in the Order Details
     cell. Holds the selected shipment so the drawer can render it as
     plain text. */
  const [viewShipmentFor, setViewShipmentFor] = useState<Shipment | null>(null);

  /* ─── Derived: filtered orders (Pending tab) ─────────────── */
  const filteredOrders = useMemo(() => {
    let list = orders;

    if (pendingBucket === 'waiting') {
      list = list.filter((o) => !o.needsAttention && !o.incomplete);
    } else if (pendingBucket === 'attention') {
      list = list.filter((o) => o.needsAttention);
    } else if (pendingBucket === 'incomplete') {
      list = list.filter((o) => o.incomplete);
    }

    if (filters.pickupLocations.length > 0) {
      list = list.filter((o) => filters.pickupLocations.includes(o.pickupLocation));
    }
    if (filters.paymentMode) {
      const wantMode = filters.paymentMode === 'cod' ? 'COD' : 'Prepaid';
      list = list.filter((o) => o.payment.mode === wantMode);
    }
    if (filters.channels.length > 0) {
      list = list.filter((o) =>
        filters.channels.includes(o.channel.toLowerCase().replace(/\s+/g, '')),
      );
    }
    if (filters.status) {
      list = list.filter((o) => o.age === filters.status);
    }
    if (filters.tags.length > 0) {
      list = list.filter((o) => filters.tags.some((t) => o.tags.includes(t)));
    }
    if (filters.orderIdSearch.trim()) {
      const wanted = filters.orderIdSearch
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      list = list.filter((o) => wanted.includes(o.id));
    }
    return list;
  }, [orders, filters, pendingBucket]);

  /* ─── Derived: filtered shipments (every non-Pending tab) ──
     Memoising the dataset lookup keeps the downstream `useMemo` deps
     referentially stable across renders. */
  const activeShipments: Shipment[] = useMemo(
    () => (activeTab === 'pending' ? [] : SHIPMENT_DATA[activeTab]),
    [activeTab],
  );

  const filteredShipments = useMemo(() => {
    let list = activeShipments;

    /* KPI bucket — each tab uses its own bucket vocabulary so the
       filter is applied via the dedicated mapper below. */
    list = applyShipmentBucket(list, activeTab, shipmentBucket);

    if (filters.pickupLocations.length > 0) {
      list = list.filter((s) => filters.pickupLocations.includes(s.pickupLocation));
    }
    if (filters.paymentMode) {
      const wantMode = filters.paymentMode === 'cod' ? 'COD' : 'Prepaid';
      list = list.filter((s) => s.payment.mode === wantMode);
    }
    if (filters.transportMode) {
      list = list.filter((s) => s.transportMode === filters.transportMode);
    }
    if (filters.shipmentStatuses.length > 0) {
      list = list.filter((s) => filters.shipmentStatuses.includes(s.status));
    }
    if (filters.tags.length > 0) {
      list = list.filter((s) => filters.tags.some((t) => s.tags.includes(t)));
    }
    if (filters.orderIdSearch.trim()) {
      const wanted = filters.orderIdSearch
        .split(/[\s,]+/)
        .map((q) => q.trim())
        .filter(Boolean);
      list = list.filter((s) => wanted.includes(s.id));
    }
    return list;
  }, [activeShipments, activeTab, filters, shipmentBucket]);

  const pendingKpis = useMemo(() => computePendingKpis(orders), [orders]);

  /* ─── Shipment KPI tile configs per tab ──────────────────── */
  const shipmentCards: KpiCardSpec[] = useMemo(
    () => buildShipmentKpiCards(activeTab, activeShipments),
    [activeTab, activeShipments],
  );

  /* Toggle the active KPI bucket; selecting the active card again clears it. */
  const handlePendingKpiSelect = (bucket: KpiBucket) => {
    setPendingBucket((prev) => (prev === bucket ? 'all' : bucket));
  };
  const handleShipmentKpiSelect = (bucket: string) => {
    setShipmentBucket((prev) => (prev === bucket ? 'all' : bucket));
  };

  /* ─── Selection helpers (work against the current tab's rows) ── */
  const currentRows: { id: string }[] =
    activeTab === 'pending' ? filteredOrders : filteredShipments;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleSelectAll = () => {
    setSelected((prev) => {
      const allOnPage = currentRows.every((r) => prev.has(r.id));
      if (allOnPage) {
        const next = new Set(prev);
        currentRows.forEach((r) => next.delete(r.id));
        return next;
      }
      const next = new Set(prev);
      currentRows.forEach((r) => next.add(r.id));
      return next;
    });
  };

  /* ─── Row-level handlers ─────────────────────────────────── */
  const handleShip = (o: Order) =>
    showToast(`📦 Ship flow opened for order ${o.id}`);

  const handleMarkReady = (s: Shipment) =>
    showToast(`✅ ${s.id} marked ready for pickup`);

  const handlePrintInvoice = (o: { id: string }) =>
    showToast(`🖨️ Invoice for ${o.id} sent to printer`);

  const handleEditOrder = (o: { id: string }) =>
    showToast(`✏️ Edit ${o.id} — coming soon`);

  const handleCloneOrder = (o: { id: string }) =>
    showToast(`📋 Clone ${o.id} — coming soon`);

  const handleDownloadPO = (s: Shipment) =>
    showToast(`📥 Purchase order for ${s.id} downloading…`);

  const openAddTag = (o: Order | Shipment) => setAddTagFor(o);

  const openCancel = (o: Order | Shipment) => setCancelFor([o]);

  const saveTags = (id: string, nextTags: string[], created: string[]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, tags: nextTags } : o)),
    );
    if (created.length > 0) {
      setTagPool((prev) => Array.from(new Set([...prev, ...created])));
    }
    setAddTagFor(null);
    showToast(`🏷️ Tags saved for ${id}`);
  };

  const confirmCancel = () => {
    if (!cancelFor) return;
    const ids = new Set(cancelFor.map((o) => o.id));
    setOrders((prev) => prev.filter((o) => !ids.has(o.id)));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    showToast(
      cancelFor.length === 1
        ? `✕ ${cancelFor[0].id} cancelled`
        : `✕ ${cancelFor.length} orders cancelled`,
    );
    setCancelFor(null);
  };

  /* ─── Bulk action handler ────────────────────────────────── */
  const handleBulkAction = (action: BulkAction) => {
    if (selected.size === 0) {
      showToast(`Select one or more rows to ${action.label.toLowerCase()}`);
      return;
    }
    if (activeTab === 'pending' && action.id === 'cancel') {
      const picked = orders.filter((o) => selected.has(o.id));
      setCancelFor(picked);
      return;
    }
    showToast(`✓ ${action.label} → ${selected.size} item${selected.size > 1 ? 's' : ''}`);
  };

  /* Reset all filters back to defaults (used by Clear all + Reset all). */
  const clearFilters = () => setFilters(initialPendingFilters);

  /* Tab change resets selection + per-tab KPI buckets so each tab starts fresh. */
  const handleTabChange = (id: OrderTabId) => {
    setActiveTab(id);
    setSelected(new Set());
    setPendingBucket('all');
    setShipmentBucket('all');
  };

  /* ─── Determine count label above the grid (right-aligned) ─ */
  const countLabel =
    activeTab === 'pending'
      ? `${filteredOrders.length} orders`
      : `${filteredShipments.length} shipments`;

  return (
    <div className="page">
      {/* ── Header row: title left, CTAs right ──────────────── */}
      <div className="ord-ph">
        <div className="ord-ph-l">
          <div className="ord-ph-title">Orders</div>
        </div>
        <div className="ord-ph-r">
          <button
            type="button"
            className="ord-cta ord-cta-p"
            onClick={() => navigate('/orders/new-forward')}
          >
            + Forward Order
          </button>
          <button
            type="button"
            className="ord-cta ord-cta-s"
            onClick={() => showToast('+ Reverse Order — flow coming soon')}
          >
            + Reverse Order
          </button>
        </div>
      </div>

      {/* ── KPI cards (per-tab) ─────────────────────────────── */}
      {activeTab === 'pending' && (
        <PendingKpiStrip
          kpis={pendingKpis}
          active={pendingBucket}
          onSelect={handlePendingKpiSelect}
        />
      )}
      {activeTab !== 'pending' && (
        <ShipmentKpiStrip
          cards={shipmentCards}
          active={shipmentBucket}
          onSelect={handleShipmentKpiSelect}
          ariaLabel={`${activeTab} summary`}
        />
      )}

      {/* ── Tabs (below KPI cards per the brief) ────────────── */}
      <div className="ord-tabs" role="tablist" aria-label="Order lifecycle">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTab === t.id}
            className={`ord-tab ${activeTab === t.id ? 'on' : ''}`}
            onClick={() => handleTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tools row: filter (auto-width) ←→ Bulk actions ──── */}
      <div className="ord-tools-row">
        <OrdersFilterBar
          tab={activeTab}
          state={filters}
          onChange={setFilters}
          onMoreFiltersClick={() => setDrawerOpen(true)}
          onClear={clearFilters}
        />

        <div className="ord-tools-actions">
          <button
            type="button"
            className="ord-icobtn"
            title="Bulk update"
            onClick={() => showToast('Bulk update — pick a CSV to begin')}
          >
            {BulkUpdateIcon}
          </button>
          <button
            type="button"
            className="ord-icobtn"
            title="Download report"
            onClick={() => showToast('📥 Report download started')}
          >
            {DownloadIcon}
          </button>
          <BulkActionsDropdown
            actions={BULK_ACTIONS[activeTab]}
            enabled={selected.size > 0}
            onPick={handleBulkAction}
          />
        </div>
      </div>

      {/* ── Inline count above the grid ─────────────────────── */}
      <div className="ord-count-row">
        <span className="ord-count">
          <b>{countLabel}</b>
        </span>
      </div>

      {/* ── Active tab body ─────────────────────────────────── */}
      {activeTab === 'pending' ? (
        <OrdersGrid
          orders={filteredOrders}
          selected={selected}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onShip={handleShip}
          onPrintInvoice={handlePrintInvoice}
          onEditOrder={handleEditOrder}
          onAddTag={openAddTag}
          onCloneOrder={handleCloneOrder}
          onCancelOrder={openCancel}
          onOrderIdClick={(o) => showToast(`Opening order ${o.id} detail — coming soon`)}
          sort={pendingSort}
          onSortChange={setPendingSort}
          onSelectAllPages={() => showToast(`Selecting all orders across pages…`)}
        />
      ) : (
        <ShipmentsGrid
          tab={activeTab}
          shipments={filteredShipments}
          selected={selected}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onPrintInvoice={handlePrintInvoice}
          onEditOrder={handleEditOrder}
          onAddTag={openAddTag}
          onCloneOrder={handleCloneOrder}
          onCancelOrder={openCancel}
          onOrderIdClick={(s) => {
            /* On the All Orders tab, the cell renders an explicit
               "View Details" hyperlink and clicking either the order id
               or the link should open the read-only details drawer.
               Other lifecycle tabs keep their existing toast behaviour
               until each one gets its own detail view. */
            if (activeTab === 'all') {
              setViewShipmentFor(s);
            } else {
              showToast(`Opening shipment ${s.id} detail — coming soon`);
            }
          }}
          onPrimaryAction={handleMarkReady}
          onDownloadPO={handleDownloadPO}
          sort={shipmentSort}
          onSortChange={setShipmentSort}
          onSelectAllPages={() => showToast(`Selecting all shipments across pages…`)}
        />
      )}

      {/* ── Overlays ───────────────────────────────────────── */}
      {drawerOpen && (
        <MoreFiltersDrawer
          state={filters}
          availableTags={tagPool}
          onClose={() => setDrawerOpen(false)}
          onApply={setFilters}
          onReset={() => setFilters(initialPendingFilters)}
        />
      )}

      {addTagFor && (
        <AddTagModal
          order={addTagFor as Order}
          availableTags={tagPool}
          onClose={() => setAddTagFor(null)}
          onSave={saveTags}
        />
      )}

      {cancelFor && (
        <CancelOrderModal
          orders={cancelFor as Order[]}
          onClose={() => setCancelFor(null)}
          onConfirm={confirmCancel}
        />
      )}

      {viewShipmentFor && (
        <OrderDetailsDrawer
          shipment={viewShipmentFor}
          onClose={() => setViewShipmentFor(null)}
        />
      )}

      {toast && <Toast />}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
 * Helpers — kept at module scope so the component body stays light.
 * ────────────────────────────────────────────────────────────── */

/**
 * Maps the active KPI bucket id to a Shipment[] filter. Each tab uses
 * a different bucket vocabulary (e.g. "stillWaiting" for Ready to Ship,
 * "slowInMovement" for In Transit). Falls through to the unfiltered
 * list when no bucket is active.
 */
function applyShipmentBucket(
  list: Shipment[],
  tab: OrderTabId,
  bucket: string,
): Shipment[] {
  if (bucket === 'all') return list;
  switch (tab) {
    case 'ready-to-ship':
      if (bucket === 'stillWaiting')      return list.filter((s) => s.needsAttention);
      if (bucket === 'pickupUnscheduled') return list.filter((s) => !s.needsAttention);
      return list;
    case 'ready-to-pickup':
      if (bucket === 'awaitingPickup')    return list.filter((s) => s.needsAttention);
      if (bucket === 'pickupReattempt')   return list.filter((s) => s.status === 'pickup-reattempt' || s.status === 'awaiting-scan');
      return list;
    case 'in-transit':
      if (bucket === 'slowInMovement')    return list.filter((s) => s.needsAttention);
      if (bucket === 'outForDelivery')    return list.filter((s) => s.status === 'out-for-delivery');
      if (bucket === 'reattempted')       return list.filter((s) => s.status === 'delayed');
      return list;
    case 'delivered':
      if (bucket === 'firstAttempt')      return list.filter((s) => s.status === 'delivered');
      if (bucket === 'lateDelivery')      return list.filter((s) => s.status === 'failed');
      return list;
    case 'rto':
      if (bucket === 'rtoInTransit')      return list.filter((s) => s.status === 'rto-in-transit');
      if (bucket === 'rtoDelivered')      return list.filter((s) => s.status === 'rto-delivered' || s.status === 'rto-completed');
      if (bucket === 'rtoInitiated')      return list.filter((s) => s.status === 'rto-initiated');
      if (bucket === 'rtoCompleted')      return list.filter((s) => s.status === 'rto-completed');
      return list;
    case 'all':
      if (bucket === 'inTransit') {
        return list.filter((s) =>
          ['picked-up', 'in-transit', 'out-for-delivery'].includes(s.status),
        );
      }
      if (bucket === 'delivered') return list.filter((s) => s.status === 'delivered');
      if (bucket === 'rto')       return list.filter((s) => s.status.startsWith('rto-'));
      return list;
    default:
      return list;
  }
}

/** Per-tab KPI card configuration. Mirrors the supplied screenshots. */
function buildShipmentKpiCards(tab: OrderTabId, rows: Shipment[]): KpiCardSpec[] {
  switch (tab) {
    case 'ready-to-ship': {
      const k = computeReadyToShipKpis(rows);
      return [
        { id: 'all',                label: 'Ready to Ship',     value: k.readyToShip,
          accent: 'ink', icon: 'package' },
        { id: 'pickupUnscheduled',  label: 'Pickup Unscheduled', value: k.pickupUnscheduled,
          accent: 'blue', icon: 'clock' },
        { id: 'stillWaiting',       label: 'Still Waiting',     value: k.stillWaiting,
          pill: { label: `Sitting >${k.waitingHours} hrs`, variant: 'warn' },
          accent: 'amber', icon: 'warn' },
      ];
    }
    case 'ready-to-pickup': {
      const k = computeReadyToPickupKpis(rows);
      return [
        { id: 'all',                label: 'Scheduled for Pickup', value: k.scheduledForPickup,
          accent: 'ink', icon: 'truck' },
        { id: 'pickupReattempt',    label: 'Pickup in Reattempt', value: k.pickupReattempt,
          accent: 'blue', icon: 'clock' },
        { id: 'awaitingPickup',     label: 'Awaiting Pickup',    value: k.awaitingPickup,
          pill: { label: `Sitting >${k.waitingHours} hrs`, variant: 'warn' },
          accent: 'amber', icon: 'warn' },
      ];
    }
    case 'in-transit': {
      const k = computeInTransitKpis(rows);
      return [
        { id: 'all',             label: 'Total Orders In-Transit', value: k.totalInTransit,
          accent: 'ink', icon: 'route' },
        { id: 'slowInMovement',  label: 'Slow in Movement',  value: k.slowInMovement,
          pill: { label: `Sitting >${k.waitingHours} hrs`, variant: 'warn' },
          accent: 'amber', icon: 'warn' },
        { id: 'reattempted',     label: 'Reattempted',       value: k.reattempted,
          accent: 'blue', icon: 'clock' },
        { id: 'outForDelivery',  label: 'Out for Delivery',  value: k.outForDelivery,
          accent: 'green', icon: 'truck' },
      ];
    }
    case 'delivered': {
      const k = computeDeliveredKpis(rows);
      return [
        { id: 'all',                label: 'Total Delivered Orders', value: fmtRupees(k.totalValue),
          sub: `${k.totalCount} Orders`,
          accent: 'ink', icon: 'total' },
        { id: 'firstAttempt',       label: 'Delivery in First Attempt', value: k.firstAttempt,
          accent: 'green', icon: 'check' },
        { id: 'secondPlusAttempt',  label: 'Delivery in 2+ Attempt',    value: k.secondPlusAttempt,
          accent: 'blue', icon: 'clock' },
        { id: 'lateDelivery',       label: 'Late Delivery',             value: k.lateDelivery,
          accent: 'red', icon: 'fail' },
      ];
    }
    case 'rto': {
      const k = computeRtoKpis(rows);
      return [
        { id: 'rtoInTransit',  label: 'RTO In Transit', value: k.rtoInTransit,
          accent: 'blue', icon: 'return' },
        { id: 'rtoDelivered',  label: 'Delivered',      value: k.rtoDelivered,
          accent: 'green', icon: 'check' },
        { id: 'rtoInitiated',  label: 'RTO Initiated',  value: k.rtoInitiated,
          accent: 'amber', icon: 'warn' },
        { id: 'rtoCompleted',  label: 'RTO Completed',  value: k.rtoCompleted,
          accent: 'ink', icon: 'package' },
      ];
    }
    case 'all': {
      const k = computeAllShipmentKpis(rows);
      return [
        { id: 'all',        label: 'Total Shipments', value: k.totalShipments,
          sub: fmtRupees(k.totalValue),
          accent: 'ink', icon: 'total' },
        { id: 'inTransit',  label: 'In Transit',      value: k.inTransit,
          accent: 'blue', icon: 'route' },
        { id: 'delivered',  label: 'Delivered',       value: k.delivered,
          accent: 'green', icon: 'check' },
        { id: 'rto',        label: 'RTO',             value: k.rto,
          accent: 'red', icon: 'return' },
      ];
    }
    default:
      return [];
  }
}

export default OrdersPage;
