
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ContractAnalysisResult, ResearchResult, LegalNewsItem, DraftingSuggestion } from "./types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

// Helper for retrying failed AI calls
const withRetry = async <T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
};

export const analyzeContract = async (text: string): Promise<ContractAnalysisResult> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this legal document and extract key information in a structured format: \n\n ${text}`,
      config: {
        systemInstruction: "You are a senior legal counsel specialized in contract law. Provide meticulous analysis focusing on liabilities, risks, and obligations.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            effectiveDate: { type: Type.STRING },
            parties: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING }
                }
              }
            },
            terminationNotice: { type: Type.STRING },
            governingLaw: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
            keyClauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  riskScore: { type: Type.NUMBER }
                }
              }
            },
            summary: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text) as ContractAnalysisResult;
  });
};

export const rewriteClause = async (clauseTitle: string, clauseText: string, instruction: string): Promise<DraftingSuggestion> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Instruction: ${instruction}\n\nClause: ${clauseTitle}\nText: ${clauseText}`,
    config: {
      systemInstruction: "You are a master legal drafter. Rewrite the provided clause according to the instructions while maintaining legal validity. Provide the original, the suggested new text, and a brief explanation of the changes.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          suggestion: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ['original', 'suggestion', 'explanation']
      }
    }
  });
  return JSON.parse(response.text);
};

export const performLegalResearch = async (query: string): Promise<ResearchResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: query,
    config: {
      systemInstruction: "You are a professional legal researcher. Use Google Search to find current precedents, statutes, and legal interpretations. Always cite your sources.",
      tools: [{ googleSearch: {} }]
    }
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    ?.map(chunk => ({
      title: chunk.web?.title || 'Legal Source',
      uri: chunk.web?.uri || '#'
    })) || [];

  return {
    answer: response.text || "No research findings available.",
    sources: sources as any[]
  };
};

export const fetchTrendingLegalNews = async (): Promise<LegalNewsItem[]> => {
  // Use Flash for News Fetching as it is more stable for high-frequency search tasks
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Fetch 4 of the most significant legal news stories or regulatory updates from the last 24 hours. Focus on US Courts and major tech regulations.",
      config: {
        systemInstruction: "You are a legal news curator. Use Google Search to find current events. Format the response as a JSON array of LegalNewsItem objects. Ensure URLs are valid.",
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              source: { type: Type.STRING },
              url: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['Regulatory', 'Litigation', 'Corporate', 'Tech'] }
            },
            required: ['title', 'summary', 'source', 'url', 'category']
          }
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse legal news", e);
      return [];
    }
  });
};
