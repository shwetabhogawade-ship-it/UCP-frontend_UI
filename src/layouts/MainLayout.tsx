import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import Topbar from '../components/ui/Topbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * App shell that hosts the XpressBees Sellportal navigation.
 *
 * Owns the mobile drawer state so the Topbar hamburger and the Sidebar drawer
 * stay in sync. Desktop hover-expand behaviour is owned internally by Sidebar.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer on any route change so it never lingers across pages
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="main" id="main-content">
        <Topbar onMobileMenuClick={() => setMobileOpen(true)} />
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
