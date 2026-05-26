import React from 'react';
import { useReportsStore } from '../../store/useReportsStore';

export const SuccessModal: React.FC = () => {
  const successModal = useReportsStore((state) => state.successModal);
  const closeSuccess = useReportsStore((state) => state.closeSuccess);

  if (!successModal || !successModal.open) return null;

  const { title, rtype, freq } = successModal;

  return (
    <div
      className={`mo-ov ${successModal.open ? 'sh' : ''}`}
      onClick={(e) => e.target === e.currentTarget && closeSuccess()}
    >
      <div className="mo">
        <div className="mo-x" onClick={closeSuccess}>
          ✕
        </div>
        <div className="mo-ring">
          <svg viewBox="0 0 34 34" fill="none" width="32" height="32">
            <path d="M8 17l6 6 12-12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="mo-title" id="moTitle">
          Report Scheduled!
        </div>
        <div className="mo-sub" id="moSub">
          "{title}" scheduled as {freq}.
        </div>
        <div className="mo-detail" id="moDetail">
          <b>Report:</b> {title}
          <br />
          <b>Type:</b> {rtype}
          <br />
          <b>Frequency:</b>{' '}
          {freq === 'monthly'
            ? 'Every Month'
            : freq === 'weekly'
            ? 'Every Week'
            : 'Every Day'}
        </div>
        <button
          className="btn btn-p"
          style={{ width: '100%', marginTop: '18px', justifyContent: 'center' }}
          onClick={closeSuccess}
        >
          View Scheduled Reports
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
