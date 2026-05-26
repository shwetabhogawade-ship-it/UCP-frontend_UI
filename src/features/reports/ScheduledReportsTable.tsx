import React from 'react';
import { useReportsStore } from '../../store/useReportsStore';
import ToggleSwitch from '../../components/ui/ToggleSwitch';


export const ScheduledReportsTable: React.FC = () => {
  const reports = useReportsStore((state) => state.reports);
  const toggleReportEnabled = useReportsStore((state) => state.toggleReportEnabled);
  const openDrawer = useReportsStore((state) => state.openDrawer);
  const openDeleteConfirm = useReportsStore((state) => state.openDeleteConfirm);

  const getFreqClassAndLabel = (freq: 'month' | 'week' | 'day') => {
    switch (freq) {
      case 'month':
        return { className: 'fb-m', label: 'Monthly' };
      case 'week':
        return { className: 'fb-w', label: 'Weekly' };
      case 'day':
        return { className: 'fb-d', label: 'Daily' };
      default:
        return { className: '', label: freq };
    }
  };

  const renderToolTipList = (items: string[]) => {
    if (items.length <= 1) return null;
    const first = items[0];
    const rest = items.slice(1);
    return (
      <>
        <span>{first}</span>
        <span className="mp">
          +{rest.length} more
          <div className="mp-tip">
            <div className="mp-emails">
              {rest.map((item, idx) => (
                <div key={idx}>{item}</div>
              ))}
            </div>
          </div>
        </span>
      </>
    );
  };

  return (
    <div className="tw">
      <div className="ts">
        <table className="stbl">
          <thead>
            <tr>
              <th>Report Title</th>
              <th>Status</th>
              <th>Recipients</th>
              <th>Report Type</th>
              <th>Order Status</th>
              <th>Order Sub-Status</th>
              <th>Frequency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => {
              const { className: freqClass, label: freqLabel } = getFreqClassAndLabel(r.freq);
              return (
                <tr key={r.id} className={r.isNew ? 'row-new' : ''}>
                  <td>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                      {r.title}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <ToggleSwitch
                        checked={r.enabled}
                        onChange={() => toggleReportEnabled(r.id)}
                      />
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          color: r.enabled ? 'var(--green)' : 'var(--ink3)',
                        }}
                      >
                        {r.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px' }}>
                      {r.recipients.length > 1
                        ? renderToolTipList(r.recipients)
                        : r.recipients[0] || '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink)' }}>
                      {r.rtype}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px' }}>
                      {r.status.length > 1 ? renderToolTipList(r.status) : r.status[0] || '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px' }}>
                      {r.sub.length > 1 ? renderToolTipList(r.sub) : r.sub[0] || '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`fb ${freqClass}`}>{freqLabel}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <button className="gbl" onClick={() => openDrawer(r.id)}>
                        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
                          <path d="M9.5 1.5l3 3-9 9H.5v-3l9-9z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Edit
                      </button>
                      <button className="gbr" onClick={() => openDeleteConfirm(r.id)}>
                        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
                          <path d="M2 4h10M5 4V2h4v2M11 4l-.9 8H3.9L3 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '10px 16px', background: 'var(--s2)', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--ink3)' }}>
        Showing <b style={{ color: 'var(--ink)' }}>{reports.length}</b> scheduled reports
      </div>
    </div>
  );
};

export default ScheduledReportsTable;
