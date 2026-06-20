import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return await prisma.user.findUnique({
    where: { email: user.email! }
  });
}

// DELETE: Delete a teacher (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params; // This is the Teacher ID

    // Find teacher and linked user
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!teacher) {
      return NextResponse.json({ error: "Giáo viên không tồn tại" }, { status: 404 });
    }

    // Try deleting from Supabase Auth first
    try {
      const supabaseAdmin = createAdminClient();
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        perPage: 1000
      });

      if (!listError && users) {
        const authUser = users.find(u => u.email?.toLowerCase() === teacher.user.email.toLowerCase());
        if (authUser) {
          await supabaseAdmin.auth.admin.deleteUser(authUser.id);
        }
      }
    } catch (authErr) {
      console.error("Error deleting auth user:", authErr);
    }

    // Delete the User record in database (cascades to Teacher)
    await prisma.user.delete({
      where: { id: teacher.userId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete teacher" }, { status: 500 });
  }
}
