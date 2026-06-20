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

// GET: Fetch all tuition rates
export async function GET() {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rates = await prisma.tuitionRate.findMany({
      orderBy: { className: "asc" },
    });
    return NextResponse.json(rates);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Create or Update tuition rate (Admin only)
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { className, dailyRate, monthlyFee, note } = await req.json();

    if (!className || dailyRate === undefined) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
    }

    const rate = await prisma.tuitionRate.upsert({
      where: { className },
      update: {
        dailyRate: parseFloat(dailyRate),
        monthlyFee: parseFloat(monthlyFee || 0),
        note: note || null,
      },
      create: {
        className,
        dailyRate: parseFloat(dailyRate),
        monthlyFee: parseFloat(monthlyFee || 0),
        note: note || null,
      },
    });

    return NextResponse.json(rate);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save tuition rate" }, { status: 500 });
  }
}

// DELETE: Delete tuition rate (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.tuitionRate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
