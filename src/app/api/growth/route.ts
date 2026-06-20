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
    const studentIdParam = searchParams.get("studentId");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : (studentIdParam ? undefined : 50);

    let whereClause: any = {};
    if (studentIdParam) {
      whereClause.studentId = studentIdParam;
    }

    let records;
    if (currentUser.role === "ADMIN") {
      records = await prisma.growthRecord.findMany({
        where: whereClause,
        include: { student: { select: { id: true, fullName: true, className: true } } },
        orderBy: { date: "desc" },
        take: limit,
      });
    } else if (currentUser.role === "TEACHER") {
      if (!currentUser.teacher) {
        return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
      }
      whereClause.student = {
        className: currentUser.teacher.className,
        ...(studentIdParam ? { id: studentIdParam } : {}),
      };
      records = await prisma.growthRecord.findMany({
        where: whereClause,
        include: { student: { select: { id: true, fullName: true, className: true } } },
        orderBy: { date: "desc" },
        take: limit,
      });
    } else {
      if (!currentUser.parent) {
        return NextResponse.json([]);
      }
      whereClause.student = {
        parentId: currentUser.parent.id,
        ...(studentIdParam ? { id: studentIdParam } : {}),
      };
      records = await prisma.growthRecord.findMany({
        where: whereClause,
        include: { student: { select: { id: true, fullName: true, className: true } } },
        orderBy: { date: "desc" },
        take: limit,
      });
    }

    return NextResponse.json(records);
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

    // Only Admin or Teacher can add growth records
    if (currentUser.role !== "ADMIN" && currentUser.role !== "TEACHER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const studentId = body.studentId;
    const date = new Date(body.date);
    const height = parseFloat(body.height);
    const weight = parseFloat(body.weight);
    const healthNote = body.healthNote || null;
    const teacherComment = body.teacherComment || null;

    if (!studentId || isNaN(height) || isNaN(weight) || isNaN(date.getTime())) {
      return NextResponse.json({ error: "Dữ liệu đầu vào không hợp lệ" }, { status: 400 });
    }

    // Enforce teacher class boundary
    if (currentUser.role === "TEACHER") {
      if (!currentUser.teacher) {
        return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
      }
      const student = await prisma.student.findUnique({ where: { id: studentId } });
      if (!student || student.className !== currentUser.teacher.className) {
        return NextResponse.json({ error: "Giáo viên chỉ được chỉnh sửa bản ghi sự phát triển lớp mình phụ trách" }, { status: 403 });
      }
    }

    // Find if a record already exists for this student in the same calendar month
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

    const existingRecord = await prisma.growthRecord.findFirst({
      where: {
        studentId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    if (existingRecord) {
      // Overwrite the existing monthly record instead of creating duplicates
      const updatedRecord = await prisma.growthRecord.update({
        where: { id: existingRecord.id },
        data: {
          height,
          weight,
          healthNote,
          teacherComment,
          date // Keep the new exact measurement date
        }
      });
      return NextResponse.json({ record: updatedRecord, updated: true }, { status: 200 });
    }

    // Otherwise create a brand new record
    const record = await prisma.growthRecord.create({
      data: {
        studentId,
        date,
        height,
        weight,
        healthNote,
        teacherComment,
      },
    });
    return NextResponse.json({ record, updated: false }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create or update record" }, { status: 500 });
  }
}
