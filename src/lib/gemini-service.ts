import { GoogleGenerativeAI } from "@google/generative-ai";
import { ghanaianNamesValidator, NameValidationResult } from "./ghanaian-names-validator";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface FilteredTranscription {
  originalText: string;
  filteredText: string;
  confidence: number;
  type: "name" | "location" | "other";
  officialLocation?: string; // Full official location name from geocoding API
  nameValidation?: NameValidationResult; // Validation result for names
}

export class GeminiTranscriptionFilter {
  private model: ReturnType<typeof genAI.getGenerativeModel>;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  }

  // Geocoding function to validate and get official location names
  private async geocodeLocation(location: string): Promise<string | null> {
    try {
      console.log("Geocoding location:", location);
      
      // Check if we're on the client side or server side
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      const response = await fetch(
        `${baseUrl}/api/geocode-location?location=${encodeURIComponent(location)}`
      );
      
      if (!response.ok) {
        console.log("Geocoding API error:", response.status);
        return null;
      }
      
      const data = await response.json();
      console.log("Geocoding response:", data);
      
      if (data.officialLocation) {
        console.log("Found official location:", data.officialLocation);
        return data.officialLocation;
      }
      
      console.log("No location found for:", location);
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }

  async filterTranscription(transcription: string, fieldType: "name" | "location" = "name"): Promise<FilteredTranscription> {
    try {
      let prompt = "";
      
      if (fieldType === "name") {
        prompt = `You are an expert in Ghanaian names. Your task is to analyze the given transcription and convert it to the most likely Ghanaian name.

Rules:
1. ONLY convert if the transcription sounds like a Ghanaian name
2. If it doesn't sound like a name, return the original text unchanged
3. Consider common Ghanaian names like Kwame, Akosua, Kofi, Ama, Nana, Yaw, Abena, etc.
4. Be conservative - only change if you are confident it is a Ghanaian name
5. Do NOT convert locations or other words to names
6. Focus on authentic Ghanaian names from Akan, Ewe, Ga, and other Ghanaian ethnic groups

Transcription: "${transcription}"

Please respond in this exact JSON format:
{
  "originalText": "${transcription}",
  "filteredText": "the corrected Ghanaian name or original text if not a name",
  "confidence": 0.85,
  "type": "name" or "other"
}

Only return the JSON, no other text.`;
      } else if (fieldType === "location") {
        prompt = `You are an expert in Ghanaian locations. Your task is to analyze the given transcription and convert it to the most likely Ghanaian place name.

Rules:
1. ONLY convert if the transcription sounds like a location in Ghana
2. If it doesn't sound like a location, return the original text unchanged
3. Consider Ghanaian locations like Accra, Kumasi, Tamale, Cape Coast, Tema, Takoradi, etc.
4. Be conservative - only change if you are confident it is a Ghanaian location
5. Do NOT convert names or other words to locations

Transcription: "${transcription}"

Please respond in this exact JSON format:
{
  "originalText": "${transcription}",
  "filteredText": "the corrected Ghanaian location or original text if not a location",
  "confidence": 0.85,
  "type": "location" or "other"
}

Only return the JSON, no other text.`;
      }

      const result = await this.model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Extract JSON from markdown code blocks if present
  let jsonText = text.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  
  const filteredResult = JSON.parse(jsonText);
  
  // If it's a name and we got a filtered result, validate it with our database
  if (fieldType === "name" && filteredResult.type === "name") {
    const validation = ghanaianNamesValidator.validateName(filteredResult.filteredText);
    filteredResult.nameValidation = validation;
    
    // If validation suggests a better name, use it
    if (validation.suggestedName && validation.confidence > 0.7) {
      filteredResult.filteredText = validation.suggestedName;
      filteredResult.confidence = Math.max(filteredResult.confidence, validation.confidence);
    }
  }
  
  // If it's a location and we got a filtered result, try to geocode it
  if (fieldType === "location" && filteredResult.type === "location") {
    const officialLocation = await this.geocodeLocation(filteredResult.filteredText);
    if (officialLocation) {
      filteredResult.officialLocation = officialLocation;
    }
  }
  
  return {
    originalText: filteredResult.originalText,
    filteredText: filteredResult.filteredText,
    confidence: filteredResult.confidence,
    type: filteredResult.type,
    officialLocation: filteredResult.officialLocation,
    nameValidation: filteredResult.nameValidation
  };
} catch (apiError: unknown) {
  // Handle quota exceeded or other API errors
    if ((apiError as { status?: number; message?: string })?.status === 429 || (apiError as { status?: number; message?: string })?.message?.includes('quota')) {
    console.warn("Gemini API quota exceeded, using fallback validation");
    
    // Fallback to local validation only
    if (fieldType === "name") {
      const validation = ghanaianNamesValidator.validateName(transcription);
      return {
        originalText: transcription,
        filteredText: validation.suggestedName || transcription,
        confidence: validation.confidence,
        type: validation.isValid ? "name" : "other",
        nameValidation: validation
      };
    } else if (fieldType === "location") {
      // For locations, just return the original text
      return {
        originalText: transcription,
        filteredText: transcription,
        confidence: 0.5,
        type: "other"
      };
    }
  }
  
  // Re-throw other errors
  throw apiError;
    }
  }
}

export const geminiFilter = new GeminiTranscriptionFilter();



