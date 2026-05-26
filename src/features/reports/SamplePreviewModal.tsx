import React, { useState } from 'react';
import { useReportsStore } from '../../store/useReportsStore';
import { reportsApi } from '../../services/reportsApi';

export const SamplePreviewModal: React.FC = () => {
  const samplePreview = useReportsStore((state) => state.samplePreview);
  const closeSample = useReportsStore((state) => state.closeSample);
  const showToast = useReportsStore((state) => state.showToast);

  const [activeTabIdx, setActiveTabIdx] = useState(0);

  if (!samplePreview || !samplePreview.open) return null;

  const { type: sampleType, title } = samplePreview;

  const SAMP_TABS: Record<string, { label: string; key: string }[]> = {
    allorders: [{ label: 'Sample Data', key: 'ao' }],
    intransit: [{ label: 'Sample Data', key: 'it' }],
    ndr: [{ label: 'Sample Data', key: 'ndr' }],
    performance: [
      { label: 'Overall Delivery', key: 'perf_overall' },
      { label: 'Prepaid / COD', key: 'perf_cod' },
      { label: 'SLA Performance', key: 'perf_sla' },
      { label: 'Attemptwise', key: 'perf_attempt' },
      { label: 'Statewise', key: 'perf_state' },
      { label: 'RTO Reasons', key: 'perf_rto' }
    ]
  };

  const tabs = SAMP_TABS[sampleType] || [];
  const currentTab = tabs[activeTabIdx] || tabs[0] || { key: 'ao' };

  const handleDownload = async () => {
    showToast(`⬇ Preparing "Sample Report"…`);
    try {
      await reportsApi.downloadReport("Sample Report");
      showToast(`✓ "Sample Report" downloaded`);
    } catch {
      showToast('❌ Download failed');
    }
  };

  const renderTableContent = () => {
    const key = currentTab.key;
    if (key === 'ao') {
      return (
        <table className="stbl-s">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>AWB</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Weight</th>
              <th>Order Date</th>
              <th>Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ORD-20010</td>
              <td style={{ fontFamily: 'var(--mono)' }}>XB150487239</td>
              <td>Delivered</td>
              <td>COD</td>
              <td>Mumbai Hub</td>
              <td>Delhi</td>
              <td>1.2 kg</td>
              <td>01 Apr</td>
              <td>04 Apr</td>
            </tr>
            <tr>
              <td>ORD-20011</td>
              <td style={{ fontFamily: 'var(--mono)' }}>XB150487240</td>
              <td>RTO</td>
              <td>Prepaid</td>
              <td>Pune Hub</td>
              <td>Bangalore</td>
              <td>0.8 kg</td>
              <td>02 Apr</td>
              <td>—</td>
            </tr>
            <tr>
              <td>ORD-20012</td>
              <td style={{ fontFamily: 'var(--mono)' }}>XB150487241</td>
              <td>In Transit</td>
              <td>COD</td>
              <td>Chennai</td>
              <td>Hyderabad</td>
              <td>2.1 kg</td>
              <td>03 Apr</td>
              <td>—</td>
            </tr>
            <tr>
              <td>ORD-20013</td>
              <td style={{ fontFamily: 'var(--mono)' }}>XB150487242</td>
              <td>Delivered</td>
              <td>Prepaid</td>
              <td>Delhi Hub</td>
              <td>Jaipur</td>
              <td>0.5 kg</td>
              <td>04 Apr</td>
              <td>06 Apr</td>
            </tr>
          </tbody>
        </table>
      );
    } else if (key === 'it') {
      return (
        <table className="stbl-s">
          <thead>
            <tr>
              <th>AWB</th>
              <th>Order ID</th>
              <th>Last Hub Scan</th>
              <th>Hub Location</th>
              <th>EDD</th>
              <th>SLA Status</th>
              <th>Days in Transit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontFamily: 'var(--mono)' }}>XB150488010</td>
              <td>ORD-21100</td>
              <td>17 May, 08:42</td>
              <td>Delhi DC</td>
              <td>18 May</td>
              <td><span style={{ color: 'var(--green)', fontWeight: 600 }}>On Time</span></td>
              <td>3</td>
            </tr>
            <tr>
              <td style={{ fontFamily: 'var(--mono)' }}>XB150488011</td>
              <td>ORD-21101</td>
              <td>16 May, 15:15</td>
              <td>Bangalore Sorting</td>
              <td>17 May</td>
              <td><span style={{ color: 'var(--red)', fontWeight: 600 }}>Delayed</span></td>
              <td>5</td>
            </tr>
            <tr>
              <td style={{ fontFamily: 'var(--mono)' }}>XB150488012</td>
              <td>ORD-21102</td>
              <td>17 May, 07:55</td>
              <td>Hyderabad Hub</td>
              <td>18 May</td>
              <td><span style={{ color: 'var(--green)', fontWeight: 600 }}>On Time</span></td>
              <td>2</td>
            </tr>
          </tbody>
        </table>
      );
    } else if (key === 'ndr') {
      return (
        <table className="stbl-s">
          <thead>
            <tr>
              <th>AWB</th>
              <th>NDR Reason</th>
              <th>Attempts</th>
              <th>NDR Date</th>
              <th>Age (Days)</th>
              <th>Seller Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontFamily: 'var(--mono)' }}>XB150487300</td>
              <td>Customer Not Available</td>
              <td>2</td>
              <td>15 May</td>
              <td>2</td>
              <td>Reattempt</td>
            </tr>
            <tr>
              <td style={{ fontFamily: 'var(--mono)' }}>XB150487301</td>
              <td>Wrong Address</td>
              <td>1</td>
              <td>16 May</td>
              <td>1</td>
              <td>Address Update</td>
            </tr>
            <tr>
              <td style={{ fontFamily: 'var(--mono)' }}>XB150487302</td>
              <td>Customer Refused</td>
              <td>3</td>
              <td>14 May</td>
              <td>3</td>
              <td>RTO Initiated</td>
            </tr>
          </tbody>
        </table>
      );
    } else if (key === 'perf_overall') {
      return (
        <table className="stbl-s">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Delivered</th>
              <th>LOST</th>
              <th>RTO</th>
              <th>Shipped</th>
              <th>STD</th>
              <th>Grand Total</th>
              <th>Delivered %</th>
              <th>RTO %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rest Of India</td>
              <td>2,150</td>
              <td>10</td>
              <td>610</td>
              <td>95</td>
              <td>5</td>
              <td>2,870</td>
              <td>75%</td>
              <td>21%</td>
            </tr>
            <tr>
              <td>Regional</td>
              <td>920</td>
              <td>5</td>
              <td>220</td>
              <td>45</td>
              <td>1</td>
              <td>1,191</td>
              <td>77%</td>
              <td>18%</td>
            </tr>
            <tr>
              <td>Within City</td>
              <td>225</td>
              <td>1</td>
              <td>25</td>
              <td>5</td>
              <td>0</td>
              <td>256</td>
              <td>88%</td>
              <td>10%</td>
            </tr>
            <tr className="total-row">
              <td>TOTAL</td>
              <td>3,825</td>
              <td>18</td>
              <td>925</td>
              <td>163</td>
              <td>6</td>
              <td>4,937</td>
              <td>77%</td>
              <td>19%</td>
            </tr>
          </tbody>
        </table>
      );
    } else if (key === 'perf_cod') {
      return (
        <table className="stbl-s">
          <thead>
            <tr>
              <th>Payment Mode</th>
              <th>Delivered</th>
              <th>LOST</th>
              <th>RTO</th>
              <th>Grand Total</th>
              <th>Delivered %</th>
              <th>RTO %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>COD</td>
              <td>2,100</td>
              <td>18</td>
              <td>860</td>
              <td>3,098</td>
              <td>68%</td>
              <td>28%</td>
            </tr>
            <tr>
              <td>PREPAID</td>
              <td>1,725</td>
              <td>2</td>
              <td>65</td>
              <td>1,902</td>
              <td>91%</td>
              <td>3%</td>
            </tr>
            <tr className="total-row">
              <td>TOTAL</td>
              <td>3,825</td>
              <td>20</td>
              <td>925</td>
              <td>5,000</td>
              <td>76.5%</td>
              <td>18.5%</td>
            </tr>
          </tbody>
        </table>
      );
    } else if (key === 'perf_sla') {
      return (
        <table className="stbl-s">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Ontime</th>
              <th>Beyond SLA</th>
              <th>RTO/UD</th>
              <th>Grand Total</th>
              <th>Ontime %</th>
              <th>Beyond SLA %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rest Of India</td>
              <td>1,820</td>
              <td>410</td>
              <td>640</td>
              <td>2,870</td>
              <td>63%</td>
              <td>14%</td>
            </tr>
            <tr>
              <td>Regional</td>
              <td>780</td>
              <td>160</td>
              <td>251</td>
              <td>1,191</td>
              <td>65%</td>
              <td>13%</td>
            </tr>
            <tr className="total-row">
              <td>TOTAL</td>
              <td>3,070</td>
              <td>630</td>
              <td>981</td>
              <td>4,681</td>
              <td>65%</td>
              <td>13%</td>
            </tr>
          </tbody>
        </table>
      );
    } else if (key === 'perf_attempt') {
      return (
        <table className="stbl-s">
          <thead>
            <tr>
              <th>Zone</th>
              <th>1st Attempt</th>
              <th>2nd Attempt</th>
              <th>3rd Attempt</th>
              <th>&gt;3 Attempts</th>
              <th>RTO/UD</th>
              <th>Grand Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rest Of India</td>
              <td>1,700</td>
              <td>320</td>
              <td>95</td>
              <td>25</td>
              <td>730</td>
              <td>2,870</td>
            </tr>
            <tr>
              <td>Regional</td>
              <td>690</td>
              <td>135</td>
              <td>42</td>
              <td>9</td>
              <td>315</td>
              <td>1,191</td>
            </tr>
            <tr className="total-row">
              <td>TOTAL</td>
              <td>2,810</td>
              <td>510</td>
              <td>149</td>
              <td>36</td>
              <td>1,176</td>
              <td>4,681</td>
            </tr>
          </tbody>
        </table>
      );
    } else if (key === 'perf_state') {
      return (
        <table className="stbl-s">
          <thead>
            <tr>
              <th>State</th>
              <th>Delivered</th>
              <th>LOST</th>
              <th>RTO</th>
              <th>Grand Total</th>
              <th>Delivered %</th>
              <th>S2A</th>
              <th>S2D</th>
              <th>FAD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MAHARASHTRA</td>
              <td>820</td>
              <td>2</td>
              <td>180</td>
              <td>1,022</td>
              <td>80%</td>
              <td>95%</td>
              <td>74%</td>
              <td>72%</td>
            </tr>
            <tr>
              <td>KARNATAKA</td>
              <td>520</td>
              <td>3</td>
              <td>130</td>
              <td>668</td>
              <td>78%</td>
              <td>94%</td>
              <td>72%</td>
              <td>70%</td>
            </tr>
            <tr>
              <td>DELHI</td>
              <td>465</td>
              <td>1</td>
              <td>95</td>
              <td>571</td>
              <td>81%</td>
              <td>97%</td>
              <td>75%</td>
              <td>74%</td>
            </tr>
            <tr className="total-row">
              <td>TOTAL</td>
              <td>2,195</td>
              <td>10</td>
              <td>555</td>
              <td>2,817</td>
              <td>78%</td>
              <td>94%</td>
              <td>72%</td>
              <td>69%</td>
            </tr>
          </tbody>
        </table>
      );
    } else if (key === 'perf_rto') {
      return (
        <table className="stbl-s">
          <thead>
            <tr>
              <th>NDR Reason</th>
              <th>0</th>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>&gt;5</th>
              <th>Grand Total</th>
              <th>Contribution %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>OTP Verified</td>
              <td>40</td>
              <td>160</td>
              <td>420</td>
              <td>140</td>
              <td>30</td>
              <td>5</td>
              <td>795</td>
              <td>35%</td>
            </tr>
            <tr>
              <td>Customer Not Available</td>
              <td>20</td>
              <td>110</td>
              <td>310</td>
              <td>90</td>
              <td>15</td>
              <td>3</td>
              <td>548</td>
              <td>24%</td>
            </tr>
            <tr>
              <td>Customer Refused</td>
              <td>5</td>
              <td>25</td>
              <td>110</td>
              <td>40</td>
              <td>10</td>
              <td>1</td>
              <td>191</td>
              <td>8%</td>
            </tr>
            <tr className="total-row">
              <td>TOTAL</td>
              <td>68</td>
              <td>313</td>
              <td>915</td>
              <td>294</td>
              <td>59</td>
              <td>9</td>
              <td>1,658</td>
              <td>72%</td>
            </tr>
          </tbody>
        </table>
      );
    }
    return null;
  };

  return (
    <div
      className={`mo-ov ${samplePreview.open ? 'sh' : ''}`}
      onClick={(e) => e.target === e.currentTarget && closeSample()}
    >
      <div className="samp-mo" id="sampMo">
        <div className="samp-mo-hdr">
          <div>
            <div className="samp-mo-title" id="sampMoTitle">
              {title} — Sample Preview
            </div>
            <div className="samp-mo-sub" id="sampMoSub">
              Representative sample data. Actual export will reflect your selected date range.
            </div>
          </div>
          <div className="mo-x" onClick={closeSample}>
            ✕
          </div>
        </div>

        <div id="sampMoBody">
          {tabs.length > 1 && (
            <div className="samp-tabs">
              {tabs.map((tab, idx) => (
                <div
                  key={tab.key}
                  className={`samp-tab ${idx === activeTabIdx ? 'on' : ''}`}
                  onClick={() => setActiveTabIdx(idx)}
                >
                  {tab.label}
                </div>
              ))}
            </div>
          )}

          <div className="samp-tbl-wrap">
            {renderTableContent()}
          </div>

          <div className="samp-dl-bar">
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green)' }}>
                📊 Sample_{sampleType}_report.xlsx
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink3)', marginTop: '1px' }}>
                Preview only · actual export reflects your date range
              </div>
            </div>
            <button className="btn btn-p btn-sm" onClick={handleDownload}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" width="12" height="12">
                <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 11h10" strokeLinecap="round" />
              </svg>
              Download Sample
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SamplePreviewModal;
