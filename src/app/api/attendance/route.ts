import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date"); // YYYY-MM-DD
    const limitParam = searchParams.get("limit");

    let whereClause: any = {};

    if (dateParam) {
      const targetDate = new Date(dateParam);
      targetDate.setUTCHours(0, 0, 0, 0);
      whereClause.date = targetDate;
    }

    let attendances;
    if (currentUser.role === "ADMIN") {
      attendances = await prisma.attendance.findMany({
        where: whereClause,
        include: { student: { select: { id: true, fullName: true, className: true } } },
        orderBy: { date: "desc" },
        take: limitParam ? parseInt(limitParam) : undefined,
      });
    } else if (currentUser.role === "TEACHER") {
      if (!currentUser.teacher) {
        return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
      }
      whereClause.student = { className: currentUser.teacher.className };
      attendances = await prisma.attendance.findMany({
        where: whereClause,
        include: { student: { select: { id: true, fullName: true, className: true } } },
        orderBy: { date: "desc" },
        take: limitParam ? parseInt(limitParam) : undefined,
      });
    } else {
      if (!currentUser.parent) {
        return NextResponse.json([]);
      }
      whereClause.student = { parentId: currentUser.parent.id };
      attendances = await prisma.attendance.findMany({
        where: whereClause,
        include: { student: { select: { id: true, fullName: true, className: true } } },
        orderBy: { date: "desc" },
        take: limitParam ? parseInt(limitParam) : undefined,
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

    // Only Admin or Teacher can add attendance records
    if (currentUser.role !== "ADMIN" && currentUser.role !== "TEACHER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // Enforce teacher class boundary
    if (currentUser.role === "TEACHER") {
      if (!currentUser.teacher) {
        return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
      }
      const teacherClass = currentUser.teacher.className;
      const studentIds = Array.isArray(body)
        ? body.map((item) => item.studentId)
        : [body.studentId];

      const invalidStudents = await prisma.student.findMany({
        where: {
          id: { in: studentIds },
          className: { not: teacherClass }
        }
      });
      if (invalidStudents.length > 0) {
        return NextResponse.json({ error: "Giáo viên chỉ được điểm danh lớp mình phụ trách" }, { status: 403 });
      }
    }

    // Support batch creation/update (upsert)
    if (Array.isArray(body)) {
      const operations = body.map((item: { studentId: string; date: string; status: string; note?: string }) => {
        const itemDate = new Date(item.date);
        itemDate.setUTCHours(0, 0, 0, 0);

        return prisma.attendance.upsert({
          where: {
            studentId_date: {
              studentId: item.studentId,
              date: itemDate,
            },
          },
          update: {
            status: item.status as "PRESENT" | "ABSENT" | "LATE",
            note: item.note || null,
          },
          create: {
            studentId: item.studentId,
            date: itemDate,
            status: item.status as "PRESENT" | "ABSENT" | "LATE",
            note: item.note || null,
          },
        });
      });
      const records = await prisma.$transaction(operations);
      return NextResponse.json(records, { status: 201 });
    }

    const itemDate = new Date(body.date);
    itemDate.setUTCHours(0, 0, 0, 0);

    const record = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: body.studentId,
          date: itemDate,
        },
      },
      update: {
        status: body.status,
        note: body.note || null,
      },
      create: {
        studentId: body.studentId,
        date: itemDate,
        status: body.status,
        note: body.note || null,
      },
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create/update" }, { status: 500 });
  }
}
