import { GoogleGenAI, Type } from "@google/genai";
import { TradeIdea } from "../types";

// NOTE: In a real production app, this would be proxied through a backend.
// For this demo, we assume the key is available or user-provided.
const getClient = () => {
    const apiKey = process.env.API_KEY || ''; // Ideally loaded from env
    if (!apiKey) {
      console.warn("No API Key found. Mocking response.");
      return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const generateTradeIdeaFromAI = async (symbol: string, context: string): Promise<TradeIdea | null> => {
  const client = getClient();
  if (!client) return null;

  try {
    const prompt = `
      Act as a senior hedge fund trader. Analyze the following market context for ${symbol}:
      ${context}

      Generate a trade idea in JSON format including direction, entry zone, stop loss, take profit targets, and a conviction score (0-100).
      Provide a brief narrative explaining the macro and technical reasoning.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            direction: { type: Type.STRING, enum: ["LONG", "SHORT"] },
            entryZoneLow: { type: Type.NUMBER },
            entryZoneHigh: { type: Type.NUMBER },
            stopLoss: { type: Type.NUMBER },
            takeProfit1: { type: Type.NUMBER },
            takeProfit2: { type: Type.NUMBER },
            conviction: { type: Type.NUMBER },
            narrative: { type: Type.STRING },
            catalysts: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["direction", "entryZoneLow", "entryZoneHigh", "stopLoss", "takeProfit1", "conviction", "narrative"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    return {
      id: Date.now().toString(),
      symbol,
      direction: data.direction,
      entryZone: [data.entryZoneLow, data.entryZoneHigh],
      stopLoss: data.stopLoss,
      takeProfit: [data.takeProfit1, data.takeProfit2 || data.takeProfit1 * 1.05],
      conviction: data.conviction,
      narrative: data.narrative,
      riskReward: Math.abs(data.takeProfit1 - data.entryZoneLow) / Math.abs(data.entryZoneLow - data.stopLoss),
      timestamp: new Date().toISOString(),
      catalysts: data.catalysts || ["Technical Structure", "Macro Flow"],
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const analyzeSentiment = async (newsText: string): Promise<{ score: number, summary: string }> => {
    const client = getClient();
    if (!client) return { score: 50, summary: "Analysis unavailable (No API Key)" };
  
    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the sentiment of this financial news snippet. Return a JSON with 'score' (0-100, where 0 is very negative, 100 very positive) and 'summary' (max 10 words). Text: ${newsText}`,
        config: {
            responseMimeType: "application/json"
        }
      });
      const data = JSON.parse(response.text || '{}');
      return { score: data.score || 50, summary: data.summary || "Neutral" };
    } catch (e) {
        return { score: 50, summary: "Error" };
    }
};
