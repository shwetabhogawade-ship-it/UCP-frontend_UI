import React from 'react';
import { useReportsStore } from '../../store/useReportsStore';

export const DeleteConfirmationModal: React.FC = () => {
  const reports = useReportsStore((state) => state.reports);
  const deleteConfirm = useReportsStore((state) => state.deleteConfirm);
  const closeDeleteConfirm = useReportsStore((state) => state.closeDeleteConfirm);
  const deleteReport = useReportsStore((state) => state.deleteReport);
  const showToast = useReportsStore((state) => state.showToast);

  if (!deleteConfirm || !deleteConfirm.open || deleteConfirm.id === null) return null;

  const targetReport = reports.find((r) => r.id === deleteConfirm.id);

  if (!targetReport) return null;

  const handleConfirmDelete = () => {
    deleteReport(targetReport.id);
    closeDeleteConfirm();
    showToast('Deleted');
  };

  const freqLabel =
    targetReport.freq === 'month'
      ? 'Monthly'
      : targetReport.freq === 'week'
      ? 'Weekly'
      : 'Daily';

  return (
    <div
      className={`mo-ov ${deleteConfirm.open ? 'sh' : ''}`}
      onClick={(e) => e.target === e.currentTarget && closeDeleteConfirm()}
    >
      <div className="del-mo">
        <div className="del-mo-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.8" width="22" height="22">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1.5 14a2 2 0 01-2 1.8H10.5a2 2 0 01-2-1.8L7 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="del-mo-title">Delete this report?</div>
        <div className="del-mo-sub">This action cannot be undone.</div>
        <div className="del-mo-card" id="delMoCard">
          <div className="del-mo-card-row">
            <span className="del-mo-card-lbl">Name</span>
            <span className="del-mo-card-val">{targetReport.title}</span>
          </div>
          <div className="del-mo-card-row">
            <span className="del-mo-card-lbl">Type</span>
            <span className="del-mo-card-val">{targetReport.rtype}</span>
          </div>
          <div className="del-mo-card-row">
            <span className="del-mo-card-lbl">Frequency</span>
            <span className="del-mo-card-val">{freqLabel}</span>
          </div>
        </div>
        <div className="del-mo-btns">
          <button className="btn btn-s" onClick={closeDeleteConfirm}>
            Cancel
          </button>
          <button
            className="btn"
            style={{ background: 'var(--red)', color: '#fff' }}
            onClick={handleConfirmDelete}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
