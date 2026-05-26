import React, { useEffect } from 'react';
import { useReportsStore } from '../../store/useReportsStore';

export const Toast: React.FC = () => {
  const toast = useReportsStore((state) => state.toast);
  const hideToast = useReportsStore((state) => state.hideToast);

  useEffect(() => {
    if (toast && toast.visible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <div className={`toast-el ${toast.visible ? 'sh' : ''}`}>
      {toast.message}
    </div>
  );
};
export default Toast;
