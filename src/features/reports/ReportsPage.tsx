import React, { useEffect } from 'react';
import { useReportsStore } from '../../store/useReportsStore';
import InstantReportsTab from './InstantReportsTab';
import ScheduledReportsTab from './ScheduledReportsTab';
import ScheduleDrawer from './ScheduleDrawer';
import SamplePreviewModal from './SamplePreviewModal';
import SuccessModal from './SuccessModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import Toast from '../../components/ui/Toast';

const ReportsPage: React.FC = () => {
  const activeTab = useReportsStore((state) => state.activeTab);
  const setActiveTab = useReportsStore((state) => state.setActiveTab);
  const fetchReports = useReportsStore((state) => state.fetchReports);
  const toast = useReportsStore((state) => state.toast);

  // Fetch initial report configurations
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="page fade">
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-.4px' }}>
          Reports
        </div>
        <div style={{ fontSize: '12px', color: 'var(--ink3)', marginTop: '2px' }}>
          Download instant reports or manage automated scheduled delivery
        </div>
      </div>

      <div className="mod-tabs">
        <div
          className={`mod-tab ${activeTab === 'instant' ? 'on' : ''}`}
          id="tabInstant"
          onClick={() => setActiveTab('instant')}
        >
          Instant Reports
        </div>
        <div
          className={`mod-tab ${activeTab === 'scheduled' ? 'on' : ''}`}
          id="tabScheduled"
          onClick={() => setActiveTab('scheduled')}
        >
          Scheduled Reports
        </div>
      </div>

      {activeTab === 'instant' ? <InstantReportsTab /> : <ScheduledReportsTab />}

      {/* Drawer and Modals */}
      <ScheduleDrawer />
      <SamplePreviewModal />
      <SuccessModal />
      <DeleteConfirmationModal />
      
      {/* Toast Alert Notifications */}
      {toast && <Toast message={toast.message} show={toast.visible} />}
    </div>
  );
};

export default ReportsPage;
