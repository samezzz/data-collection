import { NextRequest, NextResponse } from "next/server";
import { geminiFilter } from "@/lib/gemini-service";

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

    return NextResponse.json(filteredResult);
  } catch (error) {
    console.error("Error in filter-transcription API:", error);
    return NextResponse.json(
      { error: "Failed to filter transcription" },
      { status: 500 }
    );
  }
}