
import React, { useState } from 'react';
import { analyzeContract, rewriteClause } from '../geminiService';
import { ContractAnalysisResult, DraftingSuggestion } from '../types';

const ContractAnalysis: React.FC = () => {
  const [fileText, setFileText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ContractAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Drafting Assistant State
  const [selectedClauseIndex, setSelectedClauseIndex] = useState<number | null>(null);
  const [draftingInstruction, setDraftingInstruction] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftResult, setDraftResult] = useState<DraftingSuggestion | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileText(content);
    };
    reader.readAsText(file);
  };

  const startAnalysis = async () => {
    if (!fileText.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeContract(fileText);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please ensure the document content is valid.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRewrite = async () => {
    if (selectedClauseIndex === null || !result) return;
    const clause = result.keyClauses[selectedClauseIndex];
    setIsDrafting(true);
    try {
      const draft = await rewriteClause(clause.title, clause.summary, draftingInstruction);
      setDraftResult(draft);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-8 animate-fadeIn">
      {!result ? (
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm px-10 text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 text-3xl mb-6">
            <i className="fas fa-cloud-arrow-up"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Contract for Intelligence Review</h2>
          <p className="text-slate-500 mb-8 max-w-md">Our AI extracts key dates, parties, and clauses while performing a comprehensive risk assessment.</p>
          
          <div className="w-full flex flex-col gap-4">
            <textarea
              className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono text-slate-600 bg-slate-50 resize-none"
              placeholder="Paste contract text here..."
              value={fileText}
              onChange={(e) => setFileText(e.target.value)}
            ></textarea>
            
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} accept=".txt,.md" />
              <label htmlFor="file-upload" className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
                <i className="fas fa-paperclip mr-2"></i> Attach Document
              </label>
              <button
                onClick={startAnalysis}
                disabled={isAnalyzing || !fileText.trim()}
                className="px-8 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 transition-all"
              >
                {isAnalyzing ? <i className="fas fa-circle-notch fa-spin"></i> : 'Run AI Analysis'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-20">
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 legal-title">{result.title}</h1>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold">Effective: {result.effectiveDate}</span>
                    <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full font-semibold">Law: {result.governingLaw}</span>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-white font-bold text-sm bg-rose-600 shadow-lg`}>
                  {result.riskLevel} Risk
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100 italic">"{result.summary}"</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Interactive Clause Library</h3>
              <div className="space-y-4">
                {result.keyClauses.map((clause, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => { setSelectedClauseIndex(idx); setDraftResult(null); }}
                    className={`p-6 rounded-xl border cursor-pointer transition-all ${
                      selectedClauseIndex === idx 
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-md' 
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800">{clause.title}</h4>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${clause.riskScore > 7 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        Score: {clause.riskScore}/10
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{clause.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8 h-fit sticky top-8">
            <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-pen-fancy text-amber-500"></i> AI Drafting Lab
              </h3>
              {selectedClauseIndex !== null ? (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-xs text-slate-400">Drafting for: <span className="text-amber-500 font-bold">{result.keyClauses[selectedClauseIndex].title}</span></p>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-amber-500 outline-none h-24"
                    placeholder="E.g., 'Make this clause more favorable for the tenant by adding a 30-day cure period...'"
                    value={draftingInstruction}
                    onChange={(e) => setDraftingInstruction(e.target.value)}
                  ></textarea>
                  <button
                    onClick={handleRewrite}
                    disabled={isDrafting || !draftingInstruction.trim()}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-all disabled:bg-slate-700"
                  >
                    {isDrafting ? <i className="fas fa-wand-magic-sparkles fa-spin"></i> : 'Generate Pro Draft'}
                  </button>

                  {draftResult && (
                    <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-sm animate-slideUp">
                      <h5 className="font-bold text-amber-500 mb-2">Suggested Revision:</h5>
                      <p className="mb-4 text-slate-200">{draftResult.suggestion}</p>
                      <h5 className="font-bold text-white/50 text-[10px] uppercase tracking-widest mb-1">Reasoning:</h5>
                      <p className="text-xs text-slate-400 italic">{draftResult.explanation}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10">
                  <i className="fas fa-arrow-left text-3xl mb-4 text-white/20"></i>
                  <p className="text-slate-400 text-sm">Select a clause to begin interactive drafting.</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Firm Collaboration</h3>
              <button className="w-full mb-3 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">Share Analysis</button>
              <button className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Assign to Associate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractAnalysis;
