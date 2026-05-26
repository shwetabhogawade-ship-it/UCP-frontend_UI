import React from 'react';
import Sidebar from '../components/ui/Sidebar';
import Topbar from '../components/ui/Topbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar />
        {children}
      </div>
    </div>
  );
};
export default MainLayout;
