import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedUser } from "@/lib/auth";

// GET: Fetch all teachers (Admin only)
export async function GET() {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const teachers = await prisma.teacher.findMany({
      include: { user: true },
      orderBy: { fullName: "asc" },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Create a new teacher (Admin only)
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email, password, fullName, phone, className } = await req.json();
    if (!email || !password || !fullName || !phone || !className) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
    }

    // 1. Create user in Supabase Auth via Admin Client
    const supabaseAdmin = createAdminClient();
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "TEACHER" }
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 2. Create user and teacher record in local Prisma database
    const newDbUser = await prisma.$transaction(async (tx) => {
      // Check if user already exists in DB
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("Email đã được sử dụng");
      }

      return await tx.user.create({
        data: {
          email,
          role: "TEACHER",
          fullName,
          teacher: {
            create: {
              fullName,
              phone,
              className,
            }
          }
        },
        include: { teacher: true }
      });
    });

    return NextResponse.json(newDbUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create teacher" }, { status: 500 });
  }
}
