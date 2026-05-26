import React from 'react';

export const Topbar: React.FC = () => {
  return (
    <div className="topbar">
      <div className="tb-srch">
        <svg viewBox="0 0 16 16" fill="none" stroke="var(--ink3)" strokeWidth="1.5" width="13" height="13">
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5l3 3" strokeLinecap="round" />
        </svg>
        <input type="text" placeholder="Search reports..." />
      </div>
      <div className="av">MR</div>
    </div>
  );
};
export default Topbar;
