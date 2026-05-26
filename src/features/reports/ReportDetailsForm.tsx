import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { useReportsStore } from '../../store/useReportsStore';

interface ReportDetailsFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export const ReportDetailsForm: React.FC<ReportDetailsFormProps> = ({
  register,
  errors,
  watch,
  setValue,
}) => {
  const openSample = useReportsStore((state) => state.openSample);
  const rType = watch('rType');

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setValue('rType', val);
    
    // Clear other specific sections if report type changes
    if (val === 'performance') {
      setValue('perfTypes', []);
      setValue('additionalMetrics', {});
    } else if (val === 'order') {
      setValue('orderTypes', ['COD', 'Prepaid', 'Pick Up']);
      setValue('orderStatuses', ['Pending', 'Ready to Ship', 'In Transit', 'Delivered', 'RTO', 'Pick Up in Reattempt', 'Awaiting Pickup', 'Out for Delivery']);
      setValue('orderSubStatuses', ['Returned', 'Undelivered', 'Delivered', 'Lost']);
    }

    // NDR forces frequency to 'month'
    if (val === 'ndr') {
      setValue('freq', 'month');
    }
  };

  const handleViewSample = (e: React.MouseEvent) => {
    e.preventDefault();
    const map: Record<string, string> = { order: 'allorders', ndr: 'ndr', performance: 'performance' };
    const titles: Record<string, string> = { order: 'Order Report', ndr: 'NDR Report', performance: 'Performance Report' };
    const typeKey = map[rType];
    if (typeKey) {
      openSample(typeKey, titles[rType]);
    }
  };

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
        <div className="ml">Select Report Type</div>
        <select
          className="mi mi-sel"
          value={rType}
          onChange={handleTypeChange}
        >
          <option value="">Select report type</option>
          <option value="order">Order Report</option>
          <option value="ndr">NDR Report</option>
          <option value="performance">Performance Report</option>
        </select>
        {errors.rType && <span style={{ color: 'var(--red)', fontSize: '11px' }}>Report type is required</span>}
      </div>

      {rType && (
        <div style={{ marginBottom: '16px', display: 'flex' }}>
          <button className="btn btn-s btn-sm" onClick={handleViewSample}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
              <path d="M2 7c2-4 8-4 10 0s-8 4-10 0z" />
              <circle cx="7" cy="7" r="2" />
            </svg>
            View Sample Report
          </button>
        </div>
      )}

      {(rType === 'order' || rType === 'ndr') && (
        <>
          <div className="mf">
            <div className="ml">Report Name</div>
            <input
              className="mi"
              type="text"
              placeholder={rType === 'order' ? 'e.g. Weekly Order Summary' : 'e.g. NDR Escalation Report'}
              {...register('rName', { required: rType === 'order' || rType === 'ndr' })}
            />
            {errors.rName && <span style={{ color: 'var(--red)', fontSize: '11px' }}>Report name is required</span>}
          </div>

          <div className="mf">
            <div className="ml">Recipients Email IDs</div>
            <input
              className="mi"
              type="text"
              placeholder="Enter email address"
              {...register('rEmail', {
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.rEmail && (
              <span style={{ color: 'var(--red)', fontSize: '11px' }}>
                {errors.rEmail.message ? String(errors.rEmail.message) : 'Recipient email is required'}
              </span>
            )}
            <div className="ml-note">Reports will be sent to the recipients' email addresses</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportDetailsForm;
