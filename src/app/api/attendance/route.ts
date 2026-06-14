import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return await prisma.user.findUnique({
    where: { email: user.email! },
    include: { parent: true }
  });
}

export async function GET() {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let attendances;
    if (currentUser.role === "ADMIN") {
      attendances = await prisma.attendance.findMany({
        include: { student: true },
        orderBy: { date: "desc" },
      });
    } else {
      if (!currentUser.parent) {
        return NextResponse.json([]);
      }
      attendances = await prisma.attendance.findMany({
        where: { student: { parentId: currentUser.parent.id } },
        include: { student: true },
        orderBy: { date: "desc" },
      });
    }

    return NextResponse.json(attendances);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only Admin can add attendance records
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    // Support batch creation
    if (Array.isArray(body)) {
      const records = await prisma.attendance.createMany({
        data: body.map((item: { studentId: string; date: string; status: string; note?: string }) => ({
          studentId: item.studentId,
          date: new Date(item.date),
          status: item.status as "PRESENT" | "ABSENT" | "LATE",
          note: item.note || null,
        })),
        skipDuplicates: true,
      });
      return NextResponse.json(records, { status: 201 });
    }
    const record = await prisma.attendance.create({
      data: {
        studentId: body.studentId,
        date: new Date(body.date),
        status: body.status,
        note: body.note || null,
      },
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
