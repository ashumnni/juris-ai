
import React from 'react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setView: (view: ViewType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'contract', label: 'Contract Analysis', icon: 'fa-file-signature' },
    { id: 'research', label: 'Legal Research', icon: 'fa-scale-balanced' },
    { id: 'consultation', label: 'Live Briefing', icon: 'fa-microphone-lines' },
  ];

  const handleLogout = () => {
    // Simple page reload to reset state for this demo
    window.location.reload();
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 legal-title">
            <i className="fas fa-gavel text-amber-500"></i>
            JurisAI Pro
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Intelligence for Counsel</p>
        </div>

        <nav className="flex-1 px-4 mt-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setView(item.id as ViewType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <i className={`fas ${item.icon} w-5 text-center`}></i>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-slate-900 shrink-0">
              JS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Jordan Smith</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Senior Partner</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-right-from-bracket"></i>
            Secure Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold capitalize text-slate-700">{activeView.replace('-', ' ')}</h2>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-sm text-slate-400">Firm-Wide Intelligence Access</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
              <i className="fas fa-bell"></i>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="bg-slate-900 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
              <i className="fas fa-plus mr-2"></i> New Project
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
