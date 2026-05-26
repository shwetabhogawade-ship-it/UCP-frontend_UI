import React from 'react';
import DateFilter from './DateFilter';
import { useReportsStore } from '../../store/useReportsStore';
import { reportsApi } from '../../services/reportsApi';

export const InstantReportsTab: React.FC = () => {
  const showToast = useReportsStore((state) => state.showToast);
  const openSample = useReportsStore((state) => state.openSample);

  const handleDownload = async (name: string) => {
    showToast(`⬇ Preparing "${name}"…`);
    try {
      await reportsApi.downloadReport(name);
      showToast(`✓ "${name}" downloaded`);
    } catch (err) {
      showToast(`❌ Failed to download "${name}"`);
    }
  };

  return (
    <div id="panelInstant">
      <div className="page-topbar">
        <DateFilter />
      </div>

      <div className="ir-grid">
        {/* All Orders */}
        <div className="ir-card">
          <div>
            <div className="ir-card-ico" style={{ background: 'var(--bl)' }}>
              <svg viewBox="0 0 20 20" fill="none" stroke="var(--blue)" strokeWidth="1.5" width="18" height="18">
                <rect x="3" y="2" width="14" height="16" rx="2" />
                <path d="M7 7h6M7 10h6M7 13h4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="ir-card-title">All Orders</div>
            <div className="ir-card-desc">
              Complete order-level export including AWB, status, dates, weight, payment mode, and courier across all shipments in the selected period.
            </div>
          </div>
          <div className="ir-actions">
            <button className="btn btn-p btn-sm" onClick={() => handleDownload('All Orders')}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" width="12" height="12">
                <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 11h10" strokeLinecap="round" />
              </svg>
              Download Report
            </button>
            <button className="btn btn-s btn-sm" onClick={() => openSample('allorders', 'All Orders')}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
                <path d="M2 7c2-4 8-4 10 0s-8 4-10 0z" />
                <circle cx="7" cy="7" r="2" />
              </svg>
              View Sample Report
            </button>
          </div>
        </div>

        {/* In-Transit Orders */}
        <div className="ir-card">
          <div>
            <div className="ir-card-ico" style={{ background: 'var(--al)' }}>
              <svg viewBox="0 0 20 20" fill="none" stroke="var(--amber)" strokeWidth="1.5" width="18" height="18">
                <path d="M2 10h12M10 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 5v10" strokeLinecap="round" />
              </svg>
            </div>
            <div className="ir-card-title">In-Transit Orders</div>
            <div className="ir-card-desc">
              Snapshot of all shipments currently moving — includes last hub scan, EDD, transit days, and SLA status per AWB.
            </div>
          </div>
          <div className="ir-actions">
            <button className="btn btn-p btn-sm" onClick={() => handleDownload('In-Transit Orders')}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" width="12" height="12">
                <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 11h10" strokeLinecap="round" />
              </svg>
              Download Report
            </button>
            <button className="btn btn-s btn-sm" onClick={() => openSample('intransit', 'In-Transit Orders')}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12">
                <path d="M2 7c2-4 8-4 10 0s-8 4-10 0z" />
                <circle cx="7" cy="7" r="2" />
              </svg>
              View Sample Report
            </button>
          </div>
        </div>

        {/* NDR Report */}
        <div className="ir-card">
          <div>
            <div className="ir-card-ico" style={{ background: 'var(--rl)' }}>
              <svg viewBox="0 0 20 20" fill="none" stroke="var(--red)" stroke-width="1.5" width="18" height="18">
                <circle cx="10" cy="10" r="8" />
                <path d="M10 6v4M10 13.5h.01" strokeLinecap="round" />
              </svg>
            </div>
            <div className="ir-card-title">NDR Report</div>
            <div className="ir-card-desc">
              Non-delivery report with failure reasons, attempt counts, NDR age, and seller action recommended per undelivered shipment.
            </div>
          </div>
          <div className="ir-actions">
            <button className="btn btn-p btn-sm" onClick={() => handleDownload('NDR Report')}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.7" width="12" height="12">
                <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 11h10" strokeLinecap="round" />
              </svg>
              Download Report
            </button>
            <button className="btn btn-s btn-sm" onClick={() => openSample('ndr', 'NDR Report')}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12">
                <path d="M2 7c2-4 8-4 10 0s-8 4-10 0z" />
                <circle cx="7" cy="7" r="2" />
              </svg>
              View Sample Report
            </button>
          </div>
        </div>

        {/* Performance Report */}
        <div className="ir-card">
          <div>
            <div className="ir-card-ico" style={{ background: 'var(--gl)' }}>
              <svg viewBox="0 0 20 20" fill="none" stroke="var(--green)" stroke-width="1.5" width="18" height="18">
                <path d="M3 15l4-4 3 3 4-5 3 3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 18h14" strokeLinecap="round" />
              </svg>
            </div>
            <div className="ir-card-title">Performance Report</div>
            <div className="ir-card-desc">
              Multi-dimensional logistics analytics with 6 focused report types:
            </div>
            <div className="perf-types-list">
              <span className="perf-type-pill">Overall Delivery</span>
              <span className="perf-type-pill">Prepaid / COD</span>
              <span className="perf-type-pill">SLA Performance</span>
              <span className="perf-type-pill">Attemptwise</span>
              <span className="perf-type-pill">Statewise</span>
              <span className="perf-type-pill">RTO Reasons</span>
            </div>
          </div>
          <div className="ir-actions">
            <button className="btn btn-p btn-sm" onClick={() => handleDownload('Performance Report')}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.7" width="12" height="12">
                <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 11h10" strokeLinecap="round" />
              </svg>
              Download Report
            </button>
            <button className="btn btn-s btn-sm" onClick={() => openSample('performance', 'Performance Report')}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12">
                <path d="M2 7c2-4 8-4 10 0s-8 4-10 0z" />
                <circle cx="7" cy="7" r="2" />
              </svg>
              View Sample Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantReportsTab;
