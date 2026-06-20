import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return await prisma.user.findUnique({
    where: { email: user.email! },
    include: { parent: true, teacher: true },
  });
}

// GET: Calculate tuition for students by month
// Query params: month (YYYY-MM), className (optional), studentId (optional)
export async function GET(req: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // YYYY-MM format
    const className = searchParams.get("className");
    const studentId = searchParams.get("studentId");

    if (!month) {
      return NextResponse.json({ error: "Month is required (YYYY-MM)" }, { status: 400 });
    }

    const [year, monthNum] = month.split("-").map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    // Build student filter
    const studentWhere: Record<string, unknown> = {};
    if (studentId) {
      studentWhere.id = studentId;
    } else if (className) {
      studentWhere.className = className;
    }

    // Access control for parents
    if (currentUser.role === "PARENT" && currentUser.parent) {
      studentWhere.parentId = currentUser.parent.id;
    }

    const students = await prisma.student.findMany({
      where: studentWhere,
      include: {
        parent: true,
        attendances: {
          where: {
            date: { gte: startDate, lte: endDate },
          },
          orderBy: { date: "asc" },
        },
      },
      orderBy: { fullName: "asc" },
    });

    // Get all tuition rates
    const tuitionRates = await prisma.tuitionRate.findMany();
    const rateMap = new Map(tuitionRates.map(r => [r.className, r]));

    const results = students.map(student => {
      const rate = rateMap.get(student.className);
      const presentDays = student.attendances.filter(
        a => a.status === "PRESENT" || a.status === "LATE"
      ).length;
      const absentDays = student.attendances.filter(
        a => a.status === "ABSENT"
      ).length;
      const totalDays = student.attendances.length;

      const dailyFee = rate ? presentDays * rate.dailyRate : 0;
      const monthlyFee = rate ? rate.monthlyFee : 0;
      const totalFee = dailyFee + monthlyFee;

      return {
        studentId: student.id,
        studentName: student.fullName,
        className: student.className,
        parentName: student.parent?.fullName || "",
        parentPhone: student.parent?.phone || "",
        month,
        presentDays,
        absentDays,
        totalDays,
        dailyRate: rate?.dailyRate || 0,
        dailyFee,
        monthlyFee,
        totalFee,
        rateName: rate ? `${rate.className}` : "Chưa cài đặt",
      };
    });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to calculate tuition" }, { status: 500 });
  }
}
