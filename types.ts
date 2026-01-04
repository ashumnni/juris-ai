
export interface LegalParty {
  name: string;
  role: string;
}

export interface ContractClause {
  title: string;
  summary: string;
  originalText?: string;
  riskScore: number; // 1-10
}

export interface ContractAnalysisResult {
  title: string;
  effectiveDate: string;
  parties: LegalParty[];
  terminationNotice: string;
  governingLaw: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  keyClauses: ContractClause[];
  summary: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ResearchResult {
  answer: string;
  sources: GroundingSource[];
}

export type ViewType = 'dashboard' | 'contract' | 'research' | 'consultation' | 'settings';

export interface Document {
  id: string;
  name: string;
  content: string;
  type: string;
  dateAdded: string;
}

export interface LegalNewsItem {
  title: string;
  summary: string;
  source: string;
  url: string;
  category: 'Regulatory' | 'Litigation' | 'Corporate' | 'Tech';
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  type: 'Filing' | 'Hearing' | 'Meeting' | 'Review';
}

export interface WatchedCase {
  id: string;
  name: string;
  status: string;
  lastUpdated: string;
  court: string;
  caseNumber: string;
  judge: string;
  partiesDetailed: string;
  summary: string;
}

export interface DraftingSuggestion {
  original: string;
  suggestion: string;
  explanation: string;
}
