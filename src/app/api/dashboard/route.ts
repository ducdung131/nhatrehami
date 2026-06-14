import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalStudents, totalParents, students, attendances] = await Promise.all([
      prisma.student.count(),
      prisma.parent.count(),
      prisma.student.findMany({ select: { className: true } }),
      prisma.attendance.findMany({ select: { status: true } }),
    ]);

    const classes = [...new Set(students.map((s) => s.className))];
    const totalClasses = classes.length;

    const totalAttendance = attendances.length;
    const presentCount = attendances.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
    const averageAttendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    // Students by class
    const studentsByClass = classes.map((c) => ({
      name: c,
      value: students.filter((s) => s.className === c).length,
    }));

    return NextResponse.json({
      totalStudents,
      totalParents,
      totalClasses,
      averageAttendanceRate,
      studentsByClass,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
