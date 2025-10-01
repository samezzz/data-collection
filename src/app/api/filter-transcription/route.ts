import { NextRequest, NextResponse } from "next/server";
import { geminiFilter } from "@/lib/gemini-service";

// Helper function for geocoding
async function geocodeLocation(location: string): Promise<string | null> {
  try {
    const encodedLocation = encodeURIComponent(location + ", Ghana");
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}&countrycodes=gh&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'DataCollectionApp/1.0'
        }
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      const displayName = result.display_name;
      if (displayName) {
        const parts = displayName.split(',');
        const ghanaLocation = parts.slice(0, -1).join(',').trim();
        return ghanaLocation;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { transcription, fieldType = "name" } = await request.json();

    if (!transcription || typeof transcription !== "string") {
      return NextResponse.json(
        { error: "Transcription text is required" },
        { status: 400 }
      );
    }

    const filteredResult = await geminiFilter.filterTranscription(transcription, fieldType);

    // Add geocoding for locations
    if (fieldType === "location" && filteredResult.type === "location") {
      const officialLocation = await geocodeLocation(filteredResult.filteredText);
      if (officialLocation) {
        filteredResult.officialLocation = officialLocation;
      }
    }

    return NextResponse.json(filteredResult);
  } catch (error) {
    console.error("Error in filter-transcription route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}