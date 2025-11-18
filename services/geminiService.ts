import { GoogleGenAI, Modality } from "@google/genai";

// Initialize the client
// The API key must be provided in the environment variable process.env.API_KEY
const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Edits an image based on a text prompt.
 * Currently sends the original image + prompt to the multimodal model.
 */
export const editImageWithAi = async (
  base64Image: string, 
  mimeType: string, 
  prompt: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Remove header if present (e.g., "data:image/png;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    return extractImageFromResponse(response);
  } catch (error: any) {
    console.error("Edit Image Error:", error);
    throw new Error(error.message || "Failed to edit image");
  }
};

/**
 * Generates a new image from scratch based on a text prompt.
 */
export const generateImageWithAi = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    return extractImageFromResponse(response);

  } catch (error: any) {
    console.error("Generate Image Error:", error);
    throw new Error(error.message || "Failed to generate image");
  }
};

// Helper to extract image data from the response structure
const extractImageFromResponse = (response: any): string => {
  if (response.candidates && response.candidates[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        // Determine mimeType if returned, otherwise assume png as typical default for GenAI
        // The response usually contains mimeType in inlineData
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
  }
  throw new Error("No image data found in the response.");
};
