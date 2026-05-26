import React, { useEffect } from 'react';
import type { UseFormWatch, UseFormSetValue, UseFormRegister } from 'react-hook-form';

interface FrequencyFormProps {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
}

export const FrequencyForm: React.FC<FrequencyFormProps> = ({
  watch,
  setValue,
  register,
}) => {
  const rType = watch('rType');
  const freq = watch('freq') || 'month';
  const rDate = watch('rDate') || '2026-05-19';
  const rDayOfWeek = watch('rDayOfWeek') || 'Wednesday';
  const rTime = watch('rTime') || '06:12';
  const dataLastNum = watch('dataLastNum') || 1;
  const dataLastUnit = watch('dataLastUnit') || 'Days';

  const isNDR = rType === 'ndr';

  // Force freq to 'month' if report type is NDR
  useEffect(() => {
    if (isNDR && freq !== 'month') {
      setValue('freq', 'month');
    }
  }, [isNDR, freq, setValue]);

  const getDayOfMonth = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '19';
      return String(d.getDate());
    } catch {
      return '19';
    }
  };

  const dayOfMonth = getDayOfMonth(rDate);
  const lowercaseUnit = dataLastUnit.toLowerCase();

  const renderSummaryText = () => {
    if (freq === 'month') {
      return (
        <>
          We'll send reports every month on <b>{dayOfMonth}th</b> with the last <b>{dataLastNum} {lowercaseUnit} data</b>
        </>
      );
    } else if (freq === 'week') {
      return (
        <>
          We'll send reports every <b>{rDayOfWeek}</b> with the last <b>{dataLastNum} {lowercaseUnit} data</b>
        </>
      );
    } else {
      return (
        <>
          We'll send reports <b>every day at {rTime}</b> with the last <b>{dataLastNum} {lowercaseUnit} data</b>
        </>
      );
    }
  };

  return (
    <div className="dc" style={{ marginBottom: 0 }}>
      <div className="dc-title">
        <div className="dc-ico">
          <svg viewBox="0 0 16 16" fill="none" stroke="var(--ink2)" strokeWidth="1.5" width="14" height="14">
            <circle cx="8" cy="8" r="6" />
            <path d="M8 5v3.5l2 1.5" strokeLinecap="round" />
          </svg>
        </div>
        Frequency Details
      </div>

      <div className="mf">
        <div className="ml">Send Reports</div>
        <div className="ftabs" id="freqTabs">
          <div
            className={`ftab ${freq === 'month' ? 'on' : ''}`}
            onClick={() => setValue('freq', 'month')}
          >
            Every Month
          </div>
          <div
            className={`ftab ${freq === 'week' ? 'on' : ''} ${isNDR ? 'dis' : ''}`}
            onClick={() => !isNDR && setValue('freq', 'week')}
          >
            Every Week
          </div>
          <div
            className={`ftab ${freq === 'day' ? 'on' : ''} ${isNDR ? 'dis' : ''}`}
            onClick={() => !isNDR && setValue('freq', 'day')}
          >
            Every Day
          </div>
        </div>
        {isNDR && (
          <div className="ndr-note" style={{ display: 'flex' }}>
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="6.5" fill="var(--al)" stroke="var(--am)" />
              <path d="M8 5.5v3.5M8 10.5h.01" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            NDR reports can only be generated on a monthly basis
          </div>
        )}
      </div>

      {freq === 'month' && (
        <div className="mf" id="dateField">
          <div className="ml">Select Date for Sending</div>
          <div className="date-input-wrap">
            <svg className="date-cal-ico" viewBox="0 0 16 16" fill="none" stroke="var(--ink3)" strokeWidth="1.5" width="15" height="15">
              <rect x="2" y="3" width="12" height="11" rx="2" />
              <path d="M2 7h12M5 2v2M11 2v2" strokeLinecap="round" />
            </svg>
            <input
              type="date"
              value={rDate}
              onChange={(e) => setValue('rDate', e.target.value)}
            />
          </div>
        </div>
      )}

      {freq === 'week' && (
        <div className="mf" id="weekField">
          <div className="ml">Select Day of Week</div>
          <select
            className="mi mi-sel"
            value={rDayOfWeek}
            onChange={(e) => setValue('rDayOfWeek', e.target.value)}
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
      )}

      <div className="mf">
        <div className="ml">Select Time</div>
        <input
          className="mi"
          type="time"
          value={rTime}
          onChange={(e) => setValue('rTime', e.target.value)}
        />
      </div>

      <div className="mf">
        <div className="ml">Get Data for the Last</div>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '10px' }}>
          <input
            className="mi"
            type="number"
            min="1"
            max="90"
            style={{ textAlign: 'center' }}
            {...register('dataLastNum', { valueAsNumber: true })}
          />
          <select
            className="mi mi-sel"
            value={dataLastUnit}
            onChange={(e) => setValue('dataLastUnit', e.target.value)}
          >
            <option value="Days">Days</option>
            <option value="Weeks">Weeks</option>
            <option value="Months">Months</option>
          </select>
        </div>
      </div>

      <div className="ibar ibar-blue" style={{ marginBottom: 0 }}>
        <svg viewBox="0 0 16 16" fill="none" width="14" height="14" style={{ flexShrink: 0 }}>
          <circle cx="8" cy="8" r="6.5" fill="var(--bl)" stroke="var(--bm)" />
          <path d="M8 7.5v4M8 5.5h.01" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>It can take up to 24 hrs in sending your first report</span>
      </div>

      <div className="fsumm" id="fSumm">
        {renderSummaryText()}
      </div>
    </div>
  );
};

export default FrequencyForm;
