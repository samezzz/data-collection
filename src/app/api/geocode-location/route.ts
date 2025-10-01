import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (!location) {
      return NextResponse.json(
        { error: "Location parameter is required" },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { error: "Geocoding API error" },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      const displayName = result.display_name;
      if (displayName) {
        // Extract just the Ghanaian location part
        const parts = displayName.split(',');
        const ghanaLocation = parts.slice(0, -1).join(',').trim();
        return NextResponse.json({ officialLocation: ghanaLocation });
      }
    }
    
    return NextResponse.json({ officialLocation: null });
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}