
import React, { useState } from 'react';
import { performLegalResearch } from '../geminiService';
import { ResearchResult } from '../types';

const LegalResearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const data = await performLegalResearch(query);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-full animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8 sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <i className="fas fa-scale-balanced text-amber-500"></i>
          AI-Powered Legal Research
        </h2>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-32 outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-700"
            placeholder="Search statutes, case law, or legal interpretations (e.g., 'Recent SEC guidance on AI disclosures')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-slate-800 disabled:bg-slate-300 transition-all flex items-center gap-2"
          >
            {isSearching ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magnifying-glass"></i>}
            Search
          </button>
        </form>
        <div className="flex gap-4 mt-4 text-xs text-slate-400 overflow-x-auto pb-2">
          <span className="whitespace-nowrap bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 cursor-pointer transition-colors" onClick={() => setQuery('Delaware corporate fiduciary duties')}>"Delaware corporate fiduciary duties"</span>
          <span className="whitespace-nowrap bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 cursor-pointer transition-colors" onClick={() => setQuery('Recent precedents on digital asset taxation')}>"Recent precedents on digital asset taxation"</span>
          <span className="whitespace-nowrap bg-slate-100 px-3 py-1 rounded-full hover:bg-slate-200 cursor-pointer transition-colors" onClick={() => setQuery('California consumer privacy act 2024 updates')}>"California consumer privacy act 2024 updates"</span>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto pr-2 pb-20">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 text-3xl mb-4">
              <i className="fas fa-gavel fa-bounce"></i>
            </div>
            <p className="text-slate-500 font-medium">Scouring statutes and global precedents...</p>
          </div>
        ) : result ? (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-sm leading-relaxed text-slate-800">
               <div className="flex items-center gap-2 mb-6 text-sm text-amber-600 font-bold uppercase tracking-wider">
                 <i className="fas fa-clipboard-check"></i>
                 Professional Intelligence Findings
               </div>
               <div className="prose prose-slate max-w-none">
                 {result.answer.split('\n').map((line, i) => (
                   <p key={i} className="mb-4 last:mb-0">{line}</p>
                 ))}
               </div>
            </div>

            {result.sources.length > 0 && (
              <div className="bg-slate-900 rounded-2xl p-8 text-white">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <i className="fas fa-link text-amber-500"></i>
                  Grounding Sources & References
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 transition-all"
                    >
                      <div className="w-10 h-10 bg-white/10 group-hover:bg-amber-500 group-hover:text-slate-900 rounded-lg flex items-center justify-center transition-colors">
                        <i className="fas fa-globe text-lg"></i>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate group-hover:text-amber-500 transition-colors">{source.title}</p>
                        <p className="text-xs text-white/40 truncate">{source.uri}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <i className="fas fa-scale-unbalanced-flip text-6xl mb-6"></i>
            <p className="text-xl font-medium">Ready for your inquiry, Counselor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalResearch;
