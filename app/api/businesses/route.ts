import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Business } from "@/types/business";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Here you would typically save to your database
    // For now, we'll just return the data
    const newBusiness: Business = {
      ...body,
      id: Date.now().toString(), // Generate a temporary ID
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(newBusiness, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}
