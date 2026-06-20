import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Use aggregated counts instead of fetching all records
    const [totalStudents, totalParents, studentsByClassName, attendanceCounts] = await Promise.all([
      prisma.student.count(),
      prisma.parent.count(),
      prisma.student.groupBy({
        by: ["className"],
        _count: { id: true },
        orderBy: { className: "asc" },
      }),
      prisma.attendance.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    ]);

    const totalClasses = studentsByClassName.length;

    // Calculate attendance rate from grouped counts
    const totalAttendance = attendanceCounts.reduce((sum, a) => sum + a._count.id, 0);
    const presentCount = attendanceCounts
      .filter((a) => a.status === "PRESENT" || a.status === "LATE")
      .reduce((sum, a) => sum + a._count.id, 0);
    const averageAttendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    const studentsByClass = studentsByClassName.map((g) => ({
      name: g.className,
      value: g._count.id,
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
