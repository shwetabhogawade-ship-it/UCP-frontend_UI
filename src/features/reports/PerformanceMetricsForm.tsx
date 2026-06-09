import React from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import MultiSelectDropdown from '../../components/ui/MultiSelectDropdown';
import { PERF_OPTIONS } from './perfConstants';
import type { PerformanceReportType } from '../../types/reports';

interface PerformanceMetricsFormProps {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export const PerformanceMetricsForm: React.FC<PerformanceMetricsFormProps> = ({
  watch,
  setValue,
}) => {
  const rType = watch('rType');
  const perfTypes = watch('perfTypes') || [];

  if (rType !== 'performance') return null;

  const perfOptions = [
    { value: 'overall', label: 'Overall Delivery Performance' },
    { value: 'codprepaid', label: 'Prepaid / COD Delivery Performance' },
    { value: 'sla', label: 'SLA Performance' },
    { value: 'attempt', label: 'Attemptwise Delivery Performance' },
    { value: 'statewise', label: 'Statewise Delivery Performance' },
    { value: 'rto', label: 'RTO Reasons' },
    { value: 'consolidated', label: 'Consolidated Performance Report ALL IN ONE' },
  ];

  const isConsolidated = perfTypes.includes('consolidated');

  return (
    <div className="dc">
      <div className="dc-title">
        <div className="dc-ico">
          <svg viewBox="0 0 16 16" fill="none" stroke="var(--ink2)" strokeWidth="1.5" width="14" height="14">
            <path d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" />
            <path d="M5 5h6M5 8h4" strokeLinecap="round" />
          </svg>
        </div>
        Report Details
      </div>

      <div className="mf">
        <div className="ml">Performance Report Type</div>
        <MultiSelectDropdown
          options={perfOptions}
          selectedValues={perfTypes}
          onChange={(val) => setValue('perfTypes', val)}
          placeholder="Select report types"
          perfSpecialLogic={true}
        />
        <div className="ml-note">
          Select one or more report types. Consolidated shows all types in a single Excel file.
        </div>
      </div>

      {isConsolidated ? (
        <div className="ibar ibar-blue" style={{ marginTop: '12px' }}>
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14" style={{ flexShrink: 0 }}>
            <circle cx="8" cy="8" r="6.5" fill="var(--bl)" stroke="var(--bm)" />
            <path d="M8 7.5v4M8 5.5h.01" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>
            Consolidated report includes all 6 performance reports in one Excel file with default metrics for each.
          </span>
        </div>
      ) : (
        perfTypes.map((subKey: string) => {
          const config = PERF_OPTIONS[subKey as PerformanceReportType];
          if (!config) return null;

          return (
            <div key={subKey} style={{ marginTop: '12px' }}>
              <div className="metrics-zone">
                <div className="mz-hdr">{config.label} — Report Content</div>
                <div className="mz-body">
                  <div className="mz-section">
                    <div className="mz-section-label">
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--orange)',
                          display: 'inline-block',
                        }}
                      />{' '}
                      Default Metrics{' '}
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 400,
                          textTransform: 'none',
                          letterSpacing: 0,
                          color: 'var(--ink3)',
                        }}
                      >
                        (always included)
                      </span>
                    </div>
                    <div className="metrics-chips">
                      {config.defaults.map((m) => (
                        <span key={m} className="m-chip m-chip-def">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PerformanceMetricsForm;
