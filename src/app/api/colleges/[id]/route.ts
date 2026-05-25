import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const college = await prisma.college.findUnique({
      where: { id: params.id },
    });

    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error("College Detail API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}