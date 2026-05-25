import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CollegeQuerySchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const parsed = CollegeQuerySchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { search, location, minFees, maxFees, minRating, page, pageSize } = parsed.data;

    const where = {
      ...(search && { name: { contains: search, mode: "insensitive" as const } }),
      ...(location && { location: { contains: location, mode: "insensitive" as const } }),
      ...(minFees !== undefined && { fees: { gte: minFees } }),
      ...(maxFees !== undefined && { fees: { lte: maxFees } }),
      ...(minRating !== undefined && { rating: { gte: minRating } }),
    };

    const [data, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy: { rating: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({ data, total, page, pageSize });
  } catch (error) {
    console.error("Colleges API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}