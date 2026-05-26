import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ReportsPage from './features/reports/ReportsPage';
import Toast from './components/ui/Toast';
import './App.css';

function App() {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showToastWithMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/reports" replace />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </MainLayout>
      <Toast message={toastMessage} show={showToast} />
    </BrowserRouter>
  );
}

export default App;
