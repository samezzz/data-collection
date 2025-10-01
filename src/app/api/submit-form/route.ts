import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { photo, fullName, phoneNumber, location } = await request.json();

    // Validate required fields
    if (!photo || !fullName || !phoneNumber || !location) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate phone number format
    const cleanedPhone = phoneNumber.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      return NextResponse.json(
        { error: "Phone number must be 10 digits" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Insert data into the converts table
    const { data, error } = await supabase
      .from('converts')
      .insert([
        {
          photo: photo,
          full_name: fullName,
          phone_number: cleanedPhone,
          location: location,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save data to database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Convert registration successful",
      data: data[0]
    });

  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}