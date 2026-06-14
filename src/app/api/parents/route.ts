import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET: Fetch all parents (Admin only)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parents = await prisma.parent.findMany({
      include: { user: true, students: true },
      orderBy: { fullName: "asc" },
    });
    return NextResponse.json(parents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Create a new parent (Admin only)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email, password, fullName, phone } = await req.json();
    if (!email || !password || !fullName || !phone) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
    }

    // 1. Create user in Supabase Auth via Admin Client
    const supabaseAdmin = createAdminClient();
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "PARENT" }
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 2. Create user and parent record in local Prisma database
    const newDbUser = await prisma.$transaction(async (tx) => {
      // Check if user already exists in DB
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("Email đã được sử dụng");
      }

      return await tx.user.create({
        data: {
          email,
          role: "PARENT",
          fullName,
          parent: {
            create: {
              fullName,
              phone,
            }
          }
        },
        include: { parent: true }
      });
    });

    return NextResponse.json(newDbUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create parent" }, { status: 500 });
  }
}
