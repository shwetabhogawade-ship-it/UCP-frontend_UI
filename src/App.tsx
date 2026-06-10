import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ReportsPage from './features/reports/ReportsPage';
import DashboardPage from './features/dashboard/DashboardPage';
import SupportPage from './features/support/SupportPage';
import OrdersPage from './features/orders/OrdersPage';
import NewForwardOrderPage from './features/orders/NewForwardOrderPage';
import NewReverseOrderPage from './features/orders/NewReverseOrderPage';
import EditForwardOrderPage from './features/orders/EditForwardOrderPage';
import PickupRequestPage from './features/orders/PickupRequestPage';
import NdrPage from './features/ndr/NdrPage';
import ComingSoonPage from './components/ui/ComingSoonPage';
import './App.css';

/**
 * Top-level routing.
 *
 * The Reports menu (built from `ui-source/screens/all_reports_v2.html`)
 * routes to `/reports`. Every other nav destination listed in
 * `data/navConfig.tsx` gets a placeholder route here so the active state
 * resolves correctly while the modules are still being built.
 */
function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Implemented modules */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reports" element={<ReportsPage />} />

          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/new-forward" element={<NewForwardOrderPage />} />
          <Route path="/orders/new-reverse" element={<NewReverseOrderPage />} />
          <Route path="/orders/:id/edit" element={<EditForwardOrderPage />} />
          <Route path="/orders/pickup-request" element={<PickupRequestPage />} />

          <Route path="/ndr" element={<NdrPage />} />

          {/* Placeholders — keep paths in sync with `data/navConfig.tsx` */}
          <Route path="/info/pincode" element={<ComingSoonPage title="Pincode Serviceability" />} />
          <Route path="/info/rate-calculator" element={<ComingSoonPage title="Rate Calculator" />} />
          <Route path="/info/rate-card" element={<ComingSoonPage title="Rate Card" />} />
          <Route path="/finance/wallet" element={<ComingSoonPage title="Wallet" />} />
          <Route path="/finance/remittance" element={<ComingSoonPage title="Remittance" />} />
          <Route path="/finance/invoices" element={<ComingSoonPage title="Invoice & Credits" />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/services" element={<ComingSoonPage title="Services" />} />
          <Route path="/services/channels" element={<ComingSoonPage title="Channels" />} />
          <Route path="/settings" element={<ComingSoonPage title="Settings" />} />

          {/* Fallback */}
          <Route path="*" element={<ComingSoonPage title="Page Not Found" />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
