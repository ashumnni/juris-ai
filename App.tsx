
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ContractAnalysis from './components/ContractAnalysis';
import LegalResearch from './components/LegalResearch';
import LiveConsultation from './components/LiveConsultation';
import LoginPage from './components/LoginPage';
import { ViewType } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'contract':
        return <ContractAnalysis />;
      case 'research':
        return <LegalResearch />;
      case 'consultation':
        return <LiveConsultation />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout activeView={activeView} setView={setActiveView}>
      {renderView()}
    </Layout>
  );
};

export default App;
