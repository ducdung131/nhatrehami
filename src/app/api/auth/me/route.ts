import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    const dbUser = await getAuthenticatedUser();

    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
      fullName: dbUser.fullName,
      isActive: dbUser.isActive,
      parent: dbUser.parent,
      teacher: dbUser.teacher,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
