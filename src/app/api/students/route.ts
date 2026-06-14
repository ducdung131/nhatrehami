import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return await prisma.user.findUnique({
    where: { email: user.email! },
    include: { parent: true }
  });
}

export async function GET() {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Access control:
    // If ADMIN, fetch all students
    // If PARENT, fetch only their linked children
    let students;
    if (currentUser.role === "ADMIN") {
      students = await prisma.student.findMany({
        include: { parent: { include: { user: true } } },
        orderBy: { createdAt: "desc" },
      });
    } else {
      if (!currentUser.parent) {
        return NextResponse.json([]);
      }
      students = await prisma.student.findMany({
        where: { parentId: currentUser.parent.id },
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
