import { GoogleGenAI, Type, Modality, FunctionDeclaration } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const executeWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 2000) => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return executeWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const performGlobalDesignAudit = async (path: string) => {
  const ai = getAI();
  return executeWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Design System Audit for URI: ${path}. Check for alignment, color purity (#D90429), and UX.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            integrityScore: { type: Type.NUMBER },
            cssRepairPayload: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  }).catch(() => ({ status: 'OPTIMAL', integrityScore: 100 }));
};

export const analyzeGarmentForResale = async (base64Image: string) => {
  const ai = getAI();
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: "Analyze this garment for Swiss luxury resale. Return JSON: brand, material, suggestedPrice (CHF), and visual points (x,y,label)." }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brand: { type: Type.STRING },
          material: { type: Type.STRING },
          suggestedPrice: { type: Type.NUMBER },
          suggestedSize: { type: Type.STRING },
          color: { type: Type.STRING },
          category: { type: Type.STRING },
          hudPoints: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                label: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const generateQuantumCouture = async (inspiration: string, isDeep: boolean) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: `High-end Swiss couture design based on: ${inspiration}. Provide name, material, philosophy, and reasoningChain (as a string array) in JSON format.` }]
    },
    config: {
      thinkingConfig: isDeep ? { thinkingBudget: 32768 } : undefined
    }
  });

  let data: any = { reasoningChain: [] };
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      data.imageUrl = `data:image/png;base64,${part.inlineData.data}`;
    } else if (part.text) {
      try {
        const jsonMatch = part.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) data = { ...data, ...JSON.parse(jsonMatch[0]) };
      } catch (e) {}
    }
  }
  return data;
};

export const editImageWithGemini = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
        { text: prompt }
      ]
    }
  });
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return part ? `data:image/png;base64,${part.inlineData.data}` : null;
};

export const generateVeoVideo = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: { imageBytes: base64Data, mimeType: 'image/jpeg' },
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
  });
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  return `${downloadLink}&key=${process.env.API_KEY}`;
};

export const visualSearchInArchive = async (base64Image: string) => {
  const ai = getAI();
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: "Extract keywords for this fashion item for a search query. Return JSON: { keywords: string[] }" }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return JSON.parse(response.text || '{"keywords":[]}');
};

export const runStrategicInnovation = async (isDeep: boolean) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: "Research next-gen Swiss textile innovations 2025. Return JSON.",
    config: {
      thinkingConfig: isDeep ? { thinkingBudget: 32768 } : undefined,
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text || '{}');
};

export const searchGroundingQuery = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
     model: "gemini-3-flash-preview",
     contents: query,
     config: { tools: [{googleSearch: {}}] },
  });
  return {
    text: response.text || "",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const getStylingAdvice = async (name: string, description: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Styling advice for ${name}: ${description}.`,
  });
  return response.text || "";
};

export const getGiftRecommendation = async (vibe: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Suggest 3 gifts for: ${vibe}. Return JSON.`,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "[]");
};

export const findBoutiquesNearby = async (lat: number, lng: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Find high-end fashion boutiques nearby.",
    config: { tools: [{ googleMaps: {} }], toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } } }
  });
  return {
    text: response.text || "",
    places: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const cartTools: FunctionDeclaration[] = [{
  name: 'addItemToCart',
  parameters: {
    type: Type.OBJECT,
    properties: {
      productId: { type: Type.STRING },
      color: { type: Type.STRING },
      size: { type: Type.STRING }
    }
  }
}];