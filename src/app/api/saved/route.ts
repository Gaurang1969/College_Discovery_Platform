import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { SaveCollegeSchema } from "@/lib/validators";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const saved = await prisma.savedCollege.findMany({
    where: { userId: session.user.id },
    include: { college: true },
  });

  return NextResponse.json(saved);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = SaveCollegeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  try {
    const saved = await prisma.savedCollege.create({
      data: { userId: session.user.id, collegeId: parsed.data.collegeId },
    });
    return NextResponse.json(saved, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Conflict or DB error" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = SaveCollegeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  await prisma.savedCollege.delete({
    where: {
      userId_collegeId: { userId: session.user.id, collegeId: parsed.data.collegeId },
    },
  });

  return NextResponse.json({ message: "Removed" }, { status: 200 });
}