import React from 'react';
import DateFilter from './DateFilter';
import ReportCard from './ReportCard';

const PERF_PILLS = [
  'Overall Delivery',
  'Prepaid / COD',
  'SLA Performance',
  'Attemptwise',
  'Statewise',
  'RTO Reasons',
];

export const InstantReportsTab: React.FC = () => {
  return (
    <div id="panelInstant">
      <div className="page-topbar">
        <DateFilter />
      </div>

      <div className="ir-grid">
        <ReportCard
          iconBg="var(--bl)"
          iconStroke="var(--blue)"
          iconSvg={
            <>
              <rect x="3" y="2" width="14" height="16" rx="2" />
              <path d="M7 7h6M7 10h6M7 13h4" strokeLinecap="round" />
            </>
          }
          title="All Orders"
          description="Complete order-level export including AWB, order date, amount, payment type, customer name, address, contact, weight, shipment status, shipping charges, discount, and product details."
          sampleType="allorders"
          reportName="All Orders"
        />

        <ReportCard
          iconBg="var(--al)"
          iconStroke="var(--amber)"
          iconSvg={
            <>
              <path d="M2 10h12M10 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 5v10" strokeLinecap="round" />
            </>
          }
          title="FWD In-Transit Orders"
          description="Live view of all forward shipments currently moving in the XpressBees network — includes AWB, Order ID, pickup-to-delivery address, SLA status (Ontime / Delayed), EDD, and days in transit."
          sampleType="fwdintransit"
          reportName="FWD In-Transit Orders"
        />

        <ReportCard
          iconBg="var(--rl)"
          iconStroke="var(--red)"
          iconSvg={
            <>
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4M10 13.5h.01" strokeLinecap="round" />
            </>
          }
          title="NDR Report"
          description="Non-delivery report with order/AWB, delivery address, shipment type, attempt count, NDR reason, payment details, last updated date, action by, and action priority per undelivered shipment."
          sampleType="ndr"
          reportName="NDR Report"
        />

        <ReportCard
          iconBg="var(--al)"
          iconStroke="var(--amber)"
          iconSvg={
            <>
              <rect x="2" y="3" width="16" height="14" rx="2" />
              <path d="M2 7h16M6 7v10M10 7v10" strokeLinecap="round" />
            </>
          }
          title="Product Wise Summary"
          description="Product-level order summary showing product name, SKU, total order quantity, booked, pending pickup, in-transit, delivered, and RTO counts — one row per product."
          sampleType="productwise"
          reportName="Product Wise Summary"
        />

        <ReportCard
          iconBg="var(--gl)"
          iconStroke="var(--green)"
          iconSvg={
            <>
              <path d="M3 15l4-4 3 3 4-5 3 3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 18h14" strokeLinecap="round" />
            </>
          }
          title="Performance Report"
          description="Multi-dimensional logistics analytics with 6 focused report types:"
          sampleType="performance"
          reportName="Performance Report"
          fullWidth
          extraContent={
            <div className="perf-types-list">
              {PERF_PILLS.map((p) => (
                <span key={p} className="perf-type-pill">
                  {p}
                </span>
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default InstantReportsTab;
