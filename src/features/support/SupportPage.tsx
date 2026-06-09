import React, { useMemo, useState } from 'react';
import { useReportsStore } from '../../store/useReportsStore';
import Toast from '../../components/ui/Toast';
import SupportKpiOverview from './components/SupportKpiOverview';
import SupportFilterBar, { type SupportFilterState } from './components/SupportFilterBar';
import TicketsTable from './components/TicketsTable';
import CreateTicketDrawer from './components/CreateTicketDrawer';
import TicketDetailDrawer from './components/TicketDetailDrawer';
import BulkTicketDrawer from './components/BulkTicketDrawer';
import { BULK_AWB_DATA, FILTER_STATUSES, INITIAL_TICKETS } from './data/supportData';
import type { TabId, Ticket } from './types';

interface DetailState {
  ticket: Ticket;
  viewOnly: boolean;
}

/**
 * Top-level Support page.
 *
 *   • Renders the page header + "+ Create Ticket" CTA.
 *   • KPI overview ("Last 30-Days Data Overview").
 *   • Tab strip — Open / Resolved / Closed (counts driven by ticket state).
 *   • Filter bar — date / sub-category / status / sort.
 *   • Tickets table.
 *   • Mounts the Create / Detail / Bulk drawers based on local state.
 *
 * Reuses the project-wide toast (`useReportsStore.showToast`) so support
 * surfaces feedback through the existing notification surface.
 */
export const SupportPage: React.FC = () => {
  const showToast = useReportsStore((s) => s.showToast);
  const toast = useReportsStore((s) => s.toast);

  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [activeTab, setActiveTab] = useState<TabId>('open');

  const [filters, setFilters] = useState<SupportFilterState>({
    dateRange: 'last30',
    subCategory: null,
    status: null,
    sort: 'new',
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [detail, setDetail] = useState<DetailState | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);

  /* ─── Counts ─────────────────────────────────────────── */

  const counts = useMemo(() => ({
    open:     tickets.filter((t) => t.status === 'open' || t.status === 'wip' || t.status === 'awaiting').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    closed:   tickets.filter((t) => t.status === 'closed').length,
  }), [tickets]);

  const wipCount      = tickets.filter((t) => t.status === 'wip').length;
  const awaitingCount = tickets.filter((t) => t.status === 'awaiting').length;
  const resolvedSla   = tickets.filter((t) => t.status === 'resolved' && t.sla === 'ok').length + 23; // pad with historical

  /* ─── Filtered rows ──────────────────────────────────── */

  const visibleRows = useMemo(() => {
    const tabPredicate = (t: Ticket) => {
      if (activeTab === 'open')     return t.status === 'open' || t.status === 'wip' || t.status === 'awaiting';
      if (activeTab === 'resolved') return t.status === 'resolved';
      return t.status === 'closed';
    };
    let list = tickets.filter(tabPredicate);
    if (filters.subCategory) {
      list = list.filter((t) => t.cat === filters.subCategory);
    }
    if (filters.status) {
      list = list.filter((t) => t.status === filters.status);
    }
    if (filters.sort === 'old') {
      list = [...list].reverse();
    }
    return list;
  }, [tickets, activeTab, filters]);

  /* ─── Handlers ───────────────────────────────────────── */

  const handleReopen = (ticket: Ticket) => {
    if (!ticket.reopenHrsLeft) return;
    setTickets((prev) => {
      const others = prev.filter((t) => t.id !== ticket.id);
      const reopened: Ticket = { ...ticket, status: 'open', isNew: true, updated: '17 May 2026, Now' };
      return [reopened, ...others];
    });
    setActiveTab('open');
    showToast(`↩ Ticket ${ticket.id} reopened — moved to top of Open tab`);
  };

  const handleMarkResolved = (id: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'resolved', reopenHrsLeft: 48 } : t
      )
    );
    setDetail(null);
    setActiveTab('resolved');
    showToast(`✓ Ticket ${id} marked as resolved`);
  };

  const handleCreated = (ticket: Ticket) => {
    setTickets((prev) => [ticket, ...prev]);
    setCreateOpen(false);
    setActiveTab('open');
  };

  const handleOpenExisting = (existingId: string, awb: string) => {
    setCreateOpen(false);
    const tk = tickets.find((t) => t.id === existingId) ?? {
      id: existingId,
      date: '15 May 2026',
      time: '11:00 AM',
      awb,
      sub: 'Issue Over Undelivered Shipment',
      cat: 'Shipment, NDR & RTO',
      status: 'open' as const,
      due: '19 May 2026, 10:00 AM',
      updated: '16 May 2026, 04:22 PM',
      sla: 'ok' as const,
    };
    setTimeout(() => setDetail({ ticket: tk, viewOnly: false }), 200);
  };

  /* ─── Render ─────────────────────────────────────────── */

  const subCategoryOptions = useMemo(() => {
    const distinct = new Set<string>();
    tickets.forEach((t) => distinct.add(t.cat));
    return Array.from(distinct).map((c) => ({ id: c, label: c }));
  }, [tickets]);

  const statusOptions = FILTER_STATUSES.map((s) => ({ id: s.id, label: s.label }));

  return (
    <div className="page fade">
      <div className="sup-ph">
        <div>
          <div className="sup-ph-title">Support</div>
          <div className="sup-ph-sub">Get help by creating a ticket or reading help articles</div>
        </div>
        <button type="button" className="btn btn-p" onClick={() => setCreateOpen(true)}>
          <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v10M3 8h10" strokeLinecap="round" />
          </svg>
          Create Ticket
        </button>
      </div>

      <SupportKpiOverview
        open={counts.open}
        wip={wipCount}
        awaiting={awaitingCount}
        resolvedSla={resolvedSla}
      />

      <div className="sup-tabs" role="tablist" aria-label="Ticket lifecycle">
        {(['open', 'resolved', 'closed'] as TabId[]).map((id) => {
          const label = id[0].toUpperCase() + id.slice(1);
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              className={`sup-tab ${activeTab === id ? 'on' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              {label}
              <span className="sup-tab-count">{counts[id]}</span>
            </button>
          );
        })}
      </div>

      <SupportFilterBar
        state={filters}
        onChange={setFilters}
        subCategoryOptions={subCategoryOptions}
        statusOptions={statusOptions}
      />

      <TicketsTable
        rows={visibleRows}
        tab={activeTab}
        onView={(t, viewOnly) => setDetail({ ticket: t, viewOnly })}
        onUpdate={(t) => setDetail({ ticket: t, viewOnly: false })}
        onReopen={handleReopen}
      />

      {createOpen && (
        <CreateTicketDrawer
          onClose={() => setCreateOpen(false)}
          onCreated={handleCreated}
          onOpenExisting={handleOpenExisting}
          showToast={showToast}
        />
      )}

      {detail && (
        <TicketDetailDrawer
          ticket={detail.ticket}
          viewOnly={detail.viewOnly}
          onClose={() => setDetail(null)}
          onMarkResolved={handleMarkResolved}
          onSendMessage={() => showToast('✓ Message sent')}
          onSubmitUpdate={() => {
            showToast('✓ Update submitted');
            setDetail(null);
          }}
        />
      )}

      {bulkOpen && (
        <BulkTicketDrawer
          rows={BULK_AWB_DATA}
          onClose={() => setBulkOpen(false)}
          onViewTicket={(row) => {
            setBulkOpen(false);
            const tk: Ticket = {
              id: row.tkId ?? 'TK-???',
              date: '17 May 2026',
              time: '10:30 AM',
              awb: row.awb,
              sub: 'Issue Over Undelivered Shipment',
              cat: 'Shipment, NDR & RTO',
              status: 'open',
              due: '19 May 2026, 10:30 AM',
              updated: '17 May 2026, 10:30 AM',
              sla: 'ok',
            };
            setTimeout(() => setDetail({ ticket: tk, viewOnly: false }), 200);
            showToast(`Viewing ticket ${tk.id} for order ${row.order}`);
          }}
        />
      )}

      {toast && <Toast />}
    </div>
  );
};

export default SupportPage;
