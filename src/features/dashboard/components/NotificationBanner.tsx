import React, { useState } from 'react';

interface NotificationBannerProps {
  children: React.ReactNode;
}

/** Dismissible top-of-page alert with an orange status dot. */
export const NotificationBanner: React.FC<NotificationBannerProps> = ({ children }) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="notif" role="status">
      <div className="notif-dot" aria-hidden="true" />
      <div className="notif-text">{children}</div>
      <button
        type="button"
        className="notif-close"
        aria-label="Dismiss notification"
        onClick={() => setVisible(false)}
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationBanner;
