import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return await prisma.user.findUnique({
    where: { email: user.email! },
    include: { parent: true, teacher: true }
  });
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    let whereClause: any = {};
    if (idsParam) {
      whereClause.id = { in: idsParam.split(",") };
    }

    if (currentUser.role === "TEACHER") {
      if (!currentUser.teacher) {
        return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
      }
      whereClause.className = currentUser.teacher.className;
    } else if (currentUser.role === "PARENT") {
      if (!currentUser.parent) {
        return NextResponse.json([]);
      }
      whereClause.parentId = currentUser.parent.id;
    }

    let students;
    if (idsParam) {
      students = await prisma.student.findMany({
        where: whereClause,
        include: {
          parent: { include: { user: true } },
          growthRecords: { orderBy: { date: "desc" } },
          attendances: { orderBy: { date: "desc" } },
        },
        orderBy: { fullName: "asc" },
      });
    } else {
      students = await prisma.student.findMany({
        where: whereClause,
        include: { parent: { include: { user: true } } },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only Admin can create students
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const student = await prisma.student.create({
      data: {
        fullName: body.fullName,
        parentId: body.parentId,
        birthDate: new Date(body.birthDate),
        gender: body.gender,
        className: body.className,
        address: body.address || null,
        avatar: body.avatar || null,
      },
    });
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
