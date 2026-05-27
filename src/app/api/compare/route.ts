import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids")?.split(",") || [];

  if (ids.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const colleges = await prisma.college.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json(colleges, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 });
  }
}