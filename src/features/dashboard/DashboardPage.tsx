import React, { useState } from 'react';
import KpiCard from './components/KpiCard';
import NotificationBanner from './components/NotificationBanner';
import DateRangeDropdown from './components/DateRangeDropdown';
import OrdersTab from './tabs/OrdersTab';
import NdrTab from './tabs/NdrTab';
import RtoTab from './tabs/RtoTab';
import { TOP_KPIS } from './data/dashboardData';

type TabId = 'orders' | 'ndr' | 'rto';

interface TabSpec {
  id: TabId;
  label: string;
  count: string;
}

const TABS: TabSpec[] = [
  { id: 'orders', label: 'Orders & Shipments', count: '1,380' },
  { id: 'ndr',    label: 'NDR',                count: '28'    },
  { id: 'rto',    label: 'RTO',                count: '64'    },
];

/**
 * Sellportal Dashboard page.
 *
 * Layout (top → bottom):
 *   • Page header (title + date-range dropdown)
 *   • "Quick Actions" section label + notification banner
 *   • 4-up severity KPIs (Pending Shipment / Pickup / NDR / Weight Dispute)
 *   • Tab strip — Orders & Shipments | NDR | RTO
 *   • Active tab body (each composed of 2- or 3-column aligned card grids)
 *
 * Wired to the `/dashboard` route — replaces the prior `ComingSoonPage`
 * so clicking "Dashboard" in the sidebar lands the user here.
 */
export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('orders');

  return (
    <div className="page">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="dash-ph">
        <div>
          <div className="dash-ph-title">Dashboard</div>
          <div className="dash-ph-sub">Last updated 2 min ago</div>
        </div>
        <DateRangeDropdown />
      </div>

      {/* ── Quick Actions strip + alert ─────────────────────────────── */}
      <div className="dash-sec-lbl">Quick Actions</div>
      <NotificationBanner>
        Action needed: <b>28 NDRs unresolved</b> — ₹2.4L revenue at risk. 1 pickup overdue at Mumbai warehouse.
      </NotificationBanner>

      {/* ── KPI strip ───────────────────────────────────────────────── */}
      <div className="kpi-grid kpi-grid-4">
        {TOP_KPIS.map((k) => (
          <KpiCard key={k.lbl} {...k} />
        ))}
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <div className="d-tabs" role="tablist" aria-label="Dashboard sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTab === t.id}
            className={`d-tab ${activeTab === t.id ? 'on' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
            <span className="d-tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── Active tab content ──────────────────────────────────────── */}
      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'ndr'    && <NdrTab />}
      {activeTab === 'rto'    && <RtoTab />}
    </div>
  );
};

export default DashboardPage;
