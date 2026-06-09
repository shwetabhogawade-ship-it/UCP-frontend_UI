import React from 'react';
import SupportKpiCard from './SupportKpiCard';

interface SupportKpiOverviewProps {
  open: number;
  wip: number;
  awaiting: number;
  resolvedSla: number;
  avgResolution?: string;
}

/**
 * "Last 30-Days Data Overview" panel — four KPI tiles inside a shared card.
 * Keeps the dashboard visual rhythm (same kpi-row spacing & card chrome).
 */
export const SupportKpiOverview: React.FC<SupportKpiOverviewProps> = ({
  open,
  wip,
  awaiting,
  resolvedSla,
  avgResolution = 'Avg resolution: 4h 32m',
}) => (
  <div className="sup-kpi-panel">
    <div className="sup-kpi-panel-lbl">Last 30-Days Data Overview</div>
    <div className="sup-kpi-row">
      <SupportKpiCard
        label="Open Tickets"
        value={open}
        accent="var(--orange)"
        iconBg="var(--ol)"
        iconStroke="var(--orange)"
        icon={
          <>
            <rect x="2" y="2" width="12" height="12" rx="2" />
            <path d="M5 8h6M8 5v6" strokeLinecap="round" />
          </>
        }
      />
      <SupportKpiCard
        label="Work In Progress"
        value={wip}
        accent="var(--amber)"
        iconBg="var(--al)"
        iconStroke="var(--amber)"
        icon={
          <>
            <circle cx="8" cy="8" r="6" />
            <path d="M8 4.5v4l2.5 1.5" strokeLinecap="round" />
          </>
        }
      />
      <SupportKpiCard
        label="Awaiting Your Response"
        value={awaiting}
        accent="var(--blue)"
        iconBg="var(--bl)"
        iconStroke="var(--blue)"
        icon={
          <>
            <path d="M2 4h12v8H2z" strokeLinejoin="round" />
            <path d="M2 4l6 5 6-5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        }
      />
      <SupportKpiCard
        label="Resolved Within SLA"
        value={resolvedSla}
        sub={avgResolution}
        accent="var(--green)"
        iconBg="var(--gl)"
        iconStroke="var(--green)"
        icon={
          <>
            <circle cx="8" cy="8" r="6" />
            <path d="M5.5 8l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
          </>
        }
      />
    </div>
  </div>
);

export default SupportKpiOverview;
