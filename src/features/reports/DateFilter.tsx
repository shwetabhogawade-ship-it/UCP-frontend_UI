import React, { useState, useEffect, useRef } from 'react';
import { useReportsStore } from '../../store/useReportsStore';
import type { DateFilterType } from '../../types/reports';

export const DateFilter: React.FC = () => {
  const dateFilter = useReportsStore((state) => state.dateFilter);
  const setDateFilter = useReportsStore((state) => state.setDateFilter);
  const showToast = useReportsStore((state) => state.showToast);

  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  // Custom range values
  const [crYear, setCrYear] = useState('2026');
  const [crMonth, setCrMonth] = useState('05');
  const [crFrom, setCrFrom] = useState('2026-04-25');
  const [crTo, setCrTo] = useState('2026-05-25');

  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const handleSelectPreset = (type: DateFilterType, label: string) => {
    if (type !== 'custom') {
      setDateFilter({
        type,
        label,
        startDate: undefined,
        endDate: undefined,
      });
      setIsOpen(false);
      setShowCustom(false);
      showToast(`Date range: ${label}`);
    }
  };

  const handleYearChange = (year: string) => {
    setCrYear(year);
    updateFromYM(year, crMonth);
  };

  const handleMonthChange = (month: string) => {
    setCrMonth(month);
    updateFromYM(crYear, month);
  };

  const updateFromYM = (year: string, month: string) => {
    const y = parseInt(year);
    const m = parseInt(month);
    const lastDay = new Date(y, m, 0).getDate();
    const startStr = `${year}-${month}-01`;
    const endStr = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    
    setCrFrom(startStr);
    setCrTo(endStr);
  };

  const handleApplyCustomRange = () => {
    if (!crFrom || !crTo) {
      showToast('Please select start and end dates');
      return;
    }
    const label = `${formatDate(crFrom)} – ${formatDate(crTo)}`;
    setDateFilter({
      type: 'custom',
      label,
      startDate: crFrom,
      endDate: crTo,
    });
    setIsOpen(false);
    showToast('Custom range applied');
  };

  return (
    <div className="date-filter-wrap" ref={containerRef}>
      <div
        className={`date-filter-btn ${isOpen ? 'open' : ''}`}
        onClick={toggleDropdown}
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="var(--ink3)" strokeWidth="1.5" width="14" height="14">
          <rect x="2" y="3" width="12" height="11" rx="2" />
          <path d="M2 7h12M5 2v2M11 2v2" strokeLinecap="round" />
        </svg>
        <span>{dateFilter.label}</span>
        <span className="chev">▾</span>
      </div>

      <div className={`date-dd ${isOpen ? 'sh' : ''}`}>
        <div
          className={`date-dd-opt ${dateFilter.type === 'last7' ? 'on' : ''}`}
          onClick={() => handleSelectPreset('last7', 'Last 7 Days')}
        >
          Last 7 Days
          {dateFilter.type === 'last7' && <span className="chk">✓</span>}
        </div>
        <div
          className={`date-dd-opt ${dateFilter.type === 'last30' ? 'on' : ''}`}
          onClick={() => handleSelectPreset('last30', 'Last 30 Days')}
        >
          Last 30 Days
          {dateFilter.type === 'last30' && <span className="chk">✓</span>}
        </div>
        <div
          className={`date-dd-opt ${dateFilter.type === 'thismonth' ? 'on' : ''}`}
          onClick={() => handleSelectPreset('thismonth', 'This Month')}
        >
          This Month
          {dateFilter.type === 'thismonth' && <span className="chk">✓</span>}
        </div>
        <div
          className={`date-dd-opt ${dateFilter.type === 'lastmonth' ? 'on' : ''}`}
          onClick={() => handleSelectPreset('lastmonth', 'Last Month')}
        >
          Last Month
          {dateFilter.type === 'lastmonth' && <span className="chk">✓</span>}
        </div>
        <div
          className="date-dd-opt"
          onClick={() => setShowCustom(!showCustom)}
        >
          Custom Range <span style={{ fontSize: '10px', color: 'var(--ink3)' }}>→</span>
        </div>

        <div className={`custom-range ${showCustom ? 'sh' : ''}`}>
          <div className="cr-label">Jump to Month / Year</div>
          <div className="cr-yms">
            <select
              className="cr-ym-sel"
              value={crYear}
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
            <select
              className="cr-ym-sel"
              value={crMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
            >
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div className="cr-label">Or select exact dates</div>
          <div className="cr-row">
            <div className="cr-input-wrap">
              <svg viewBox="0 0 14 14" fill="none" stroke="var(--ink3)" strokeWidth="1.3" width="12" height="12">
                <rect x="1" y="2" width="12" height="11" rx="1.5" />
                <path d="M1 6h12M4 1v2M10 1v2" strokeLinecap="round" />
              </svg>
              <input
                className="cr-input"
                type="date"
                value={crFrom}
                onChange={(e) => setCrFrom(e.target.value)}
              />
            </div>
            <div className="cr-input-wrap">
              <svg viewBox="0 0 14 14" fill="none" stroke="var(--ink3)" strokeWidth="1.3" width="12" height="12">
                <rect x="1" y="2" width="12" height="11" rx="1.5" />
                <path d="M1 6h12M4 1v2M10 1v2" strokeLinecap="round" />
              </svg>
              <input
                className="cr-input"
                type="date"
                value={crTo}
                onChange={(e) => setCrTo(e.target.value)}
              />
            </div>
          </div>
          <button className="cr-apply" onClick={handleApplyCustomRange}>
            Apply Range
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateFilter;
