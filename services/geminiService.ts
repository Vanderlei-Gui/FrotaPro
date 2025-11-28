import { GoogleGenAI, Type } from "@google/genai";
import { ExpenseType, Vehicle } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FLASH = 'gemini-2.5-flash';

/**
 * Analyzes a receipt image to extract expense details.
 */
export const analyzeReceiptImage = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Analise este comprovante fiscal de despesa veicular. 
            Identifique o valor total, a data, o tipo de despesa (Abastecimento, Manutenção, Peças), 
            o nome do estabelecimento e, se for combustível, a quantidade de litros e tipo de combustível.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            date: { type: Type.STRING, description: "YYYY-MM-DD format" },
            description: { type: Type.STRING },
            provider: { type: Type.STRING },
            liters: { type: Type.NUMBER, nullable: true },
            fuelType: { type: Type.STRING, nullable: true },
            confidence: { type: Type.NUMBER, description: "0 to 1 confidence score" }
          },
          required: ["amount", "date", "description", "provider"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);

  } catch (error) {
    console.error("Error analyzing receipt:", error);
    throw error;
  }
};

/**
 * Generates strategic insights for the fleet based on data.
 */
export const getFleetInsights = async (vehicles: Vehicle[], expenses: any[]) => {
  try {
    const prompt = `
      Atue como um gestor de frotas sênior. Analise os dados brutos da frota abaixo e forneça 3 insights estratégicos curtos e acionáveis para economizar dinheiro ou melhorar a eficiência.
      
      Veículos: ${JSON.stringify(vehicles.map(v => ({ model: v.model, km: v.currentKm, status: v.status })))}
      Despesas recentes: ${JSON.stringify(expenses.slice(0, 20).map(e => ({ type: e.type, amount: e.amount, date: e.date })))}
      
      Retorne APENAS um JSON array de strings.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return ["Não foi possível gerar insights no momento."];
    return JSON.parse(text);

  } catch (error) {
    console.error("Error generating insights:", error);
    return ["Erro ao conectar com a IA de análise de frota."];
  }
};
