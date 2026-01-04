
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchTrendingLegalNews } from '../geminiService';
import { LegalNewsItem, Deadline, WatchedCase } from '../types';

const usageData = [
  { name: 'Mon', tasks: 12, research: 4 },
  { name: 'Tue', tasks: 19, research: 7 },
  { name: 'Wed', tasks: 15, research: 10 },
  { name: 'Thu', tasks: 22, research: 8 },
  { name: 'Fri', tasks: 30, research: 12 },
];

const INITIAL_DEADLINES: Deadline[] = [
  { id: '1', title: 'SEC Form 10-K Filing', date: '2025-05-15', priority: 'High', type: 'Filing' },
  { id: '2', title: 'Smith vs. GlobalCorp Hearing', date: '2025-05-18', priority: 'High', type: 'Hearing' },
  { id: '3', title: 'Vendor MSA Review', date: '2025-05-20', priority: 'Medium', type: 'Review' },
  { id: '4', title: 'Internal Policy Audit', date: '2025-05-25', priority: 'Low', type: 'Meeting' },
];

const INITIAL_WATCHED_CASES: WatchedCase[] = [
  { 
    id: 'c1', 
    name: 'US v. Alphabet Inc (Antitrust)', 
    status: 'Trial Phase', 
    lastUpdated: '6h ago', 
    court: 'District Court DC',
    caseNumber: '1:20-cv-03010',
    judge: 'Hon. Amit Mehta',
    partiesDetailed: 'United States of America (Plaintiff) vs. Alphabet Inc. (Defendant)',
    summary: 'Landmark antitrust litigation focused on search distribution agreements and market dominance in digital advertising.'
  },
  { 
    id: 'c2', 
    name: 'Nvidia v. AI-Chips Patent', 
    status: 'Discovery', 
    lastUpdated: '1d ago', 
    court: 'Delaware Chancery',
    caseNumber: 'CH-2024-0012-L',
    judge: 'Vice Chancellor J. Travis Laster',
    partiesDetailed: 'Nvidia Corporation vs. AI-Chips Global Tech Ltd.',
    summary: 'High-stakes intellectual property dispute regarding specialized semiconductor architecture for neural networks.'
  },
  { 
    id: 'c3', 
    name: 'Twitter (X) v. European Union', 
    status: 'Compliance Review', 
    lastUpdated: '2h ago', 
    court: 'CJEU',
    caseNumber: 'C-242/24 P',
    judge: 'Advocate General Maciej Szpunar',
    partiesDetailed: 'X Corp (Appellant) vs. European Commission (Appellee)',
    summary: 'Appeal regarding content moderation penalties under the Digital Services Act (DSA) framework.'
  },
];

const Dashboard: React.FC = () => {
  const [news, setNews] = useState<LegalNewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(false);
  const [deadlines, setDeadlines] = useState<Deadline[]>(INITIAL_DEADLINES);
  const [watchedCases, setWatchedCases] = useState<WatchedCase[]>(INITIAL_WATCHED_CASES);
  const [selectedCase, setSelectedCase] = useState<WatchedCase | null>(null);

  const loadNews = async () => {
    setLoadingNews(true);
    setNewsError(false);
    try {
      const trendingNews = await fetchTrendingLegalNews();
      setNews(trendingNews);
    } catch (e) {
      console.error("News fetch error", e);
      setNewsError(true);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return 'bg-rose-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                  Case Docket: {selectedCase.caseNumber}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 legal-title">{selectedCase.name}</h3>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-slate-600 p-2">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Presiding Judge</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedCase.judge}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Court Jurisdiction</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedCase.court}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Parties Involved</p>
                <p className="text-sm text-slate-700 bg-indigo-50/30 p-3 rounded-xl border border-indigo-100/50">{selectedCase.partiesDetailed}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Intelligence Summary</p>
                <p className="text-sm text-slate-600 leading-relaxed italic">"{selectedCase.summary}"</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                <i className="fas fa-file-invoice mr-2"></i> View Full Docket
              </button>
              <button className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-white transition-colors">
                <i className="fas fa-bell mr-2"></i> Set Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Files', value: '142', change: '+12%', icon: 'fa-file-shield', color: 'bg-blue-600' },
          { label: 'Billable AI Hrs', value: '48.2', change: '+5%', icon: 'fa-clock', color: 'bg-indigo-600' },
          { label: 'Risks Alerted', value: '18', change: '-2%', icon: 'fa-triangle-exclamation', color: 'bg-amber-500' },
          { label: 'Success Rate', value: '94%', change: '+8%', icon: 'fa-award', color: 'bg-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/10`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</h3>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Intelligence Usage Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-chart-line text-blue-500"></i> Firm Intelligence Analytics
              </h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs text-slate-400"><span className="w-2 h-2 rounded-full bg-blue-500"></span> AI Tasks</span>
                <span className="flex items-center gap-1 text-xs text-slate-400"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Research</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="research" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cases to Watch - Enhanced with Hover Reveal */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-eye text-amber-500"></i> Cases to Watch
              </h3>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-800">Refresh Trackers</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {watchedCases.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedCase(c)}
                  className="relative p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-amber-400 hover:bg-white hover:shadow-xl hover:shadow-amber-500/10 transition-all cursor-pointer group overflow-hidden"
                >
                  <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
                    <h4 className="text-sm font-bold text-slate-800 truncate mb-1 group-hover:text-amber-600 transition-colors">{c.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-tighter">{c.court}</p>
                    
                    {/* Collapsed View Details */}
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{c.status}</span>
                      <span className="text-[10px] text-slate-400">{c.lastUpdated}</span>
                    </div>

                    {/* Hover Revealed Details */}
                    <div className="mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-gavel text-[10px] text-slate-400"></i>
                        <span className="text-[10px] font-bold text-slate-700 truncate">{c.judge}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-hashtag text-[10px] text-slate-400"></i>
                        <span className="text-[10px] font-mono text-slate-500">{c.caseNumber}</span>
                      </div>
                      <p className="mt-3 text-[10px] text-blue-600 font-bold uppercase tracking-widest text-right">Click for Full Intel <i className="fas fa-arrow-right ml-1"></i></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* News Feed - Enhanced Error Recovery */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-newspaper text-indigo-500"></i> Real-time Legal Intelligence
              </h3>
              {!newsError && !loadingNews && (
                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM NOMINAL
                </span>
              )}
            </div>
            <div className="space-y-6">
              {loadingNews ? (
                <div className="py-12 text-center">
                  <div className="inline-block w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-xs text-slate-400 font-medium">Syncing with Global Judicial Dockets...</p>
                </div>
              ) : newsError ? (
                <div className="py-10 px-8 bg-rose-50/50 rounded-3xl border border-rose-100 text-center animate-fadeIn">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-triangle-exclamation text-rose-500 text-2xl"></i>
                  </div>
                  <h4 className="text-sm font-bold text-rose-900 mb-2">Intelligence Channel Interrupted</h4>
                  <p className="text-xs text-rose-600/70 max-w-xs mx-auto mb-6 leading-relaxed">
                    The AI Gateway experienced a transient RPC Error (500). Our adaptive logic is attempting to re-establish the secure link.
                  </p>
                  <button 
                    onClick={loadNews}
                    className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 flex items-center gap-2 mx-auto"
                  >
                    <i className="fas fa-rotate"></i> Manual Synchronize
                  </button>
                </div>
              ) : news.length > 0 ? (
                news.map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer border-b border-slate-50 pb-6 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white uppercase tracking-tighter">
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{item.source}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.summary}</p>
                    </div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shrink-0">
                      <i className="fas fa-external-link-alt text-[10px]"></i>
                    </a>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-40">
                  <i className="fas fa-inbox text-3xl mb-2"></i>
                  <p className="text-sm">No new intelligence hits in the last cycle.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Deadlines & Activity */}
        <div className="space-y-8">
          
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <i className="fas fa-calendar-check text-amber-500"></i> Critical Deadlines
            </h3>
            <div className="space-y-4">
              {deadlines.map((d) => (
                <div key={d.id} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
                  <div className={`w-1 h-10 rounded-full ${getPriorityColor(d.priority)}`}></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate group-hover:text-amber-400 transition-colors">{d.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-white/40">{d.date}</span>
                      <span className="text-[10px] text-white/20">•</span>
                      <span className="text-[10px] text-amber-500/80 font-bold uppercase tracking-wider">{d.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-bold transition-all uppercase tracking-widest text-white/60 hover:text-white">
              View Master Calendar
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <i className="fas fa-history text-indigo-500"></i> Recent Activity
            </h3>
            <div className="space-y-6">
              {[
                { case: 'MSA - TechCorp', user: 'JS', time: '2h ago', status: 'Approved', color: 'text-emerald-500' },
                { case: 'NDA - Alpha Inv', user: 'AM', time: '4h ago', status: 'Flagged', color: 'text-rose-500' },
                { case: 'Lease - City Center', user: 'SK', time: '1d ago', status: 'Drafting', color: 'text-amber-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 border border-white shadow-sm">
                    {item.user}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-slate-800 truncate">{item.case}</h4>
                    <p className="text-[10px] text-slate-400">{item.time}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-50 ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
