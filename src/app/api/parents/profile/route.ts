import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// GET: Fetch current parent's profile
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      include: { parent: { include: { students: true } } },
    });

    if (!dbUser || !dbUser.parent) {
      return NextResponse.json({ error: "Parent profile not found" }, { status: 404 });
    }

    return NextResponse.json(dbUser.parent);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT: Update parent profile (self-service)
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      include: { parent: true },
    });

    if (!dbUser || !dbUser.parent) {
      return NextResponse.json({ error: "Parent profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const { phone, citizenId, address, emergencyPhone } = body;

    const updated = await prisma.parent.update({
      where: { id: dbUser.parent.id },
      data: {
        ...(phone !== undefined && { phone }),
        ...(citizenId !== undefined && { citizenId }),
        ...(address !== undefined && { address }),
        ...(emergencyPhone !== undefined && { emergencyPhone }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
