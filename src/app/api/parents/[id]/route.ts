import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedUser } from "@/lib/auth";

// DELETE: Delete a parent and all associated student data (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params; // This is the Parent ID

    // Find parent and linked user
    const parent = await prisma.parent.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!parent) {
      return NextResponse.json({ error: "Phụ huynh không tồn tại" }, { status: 404 });
    }

    // Try deleting from Supabase Auth first
    try {
      const supabaseAdmin = createAdminClient();
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        perPage: 1000
      });

      if (!listError && users) {
        const authUser = users.find(u => u.email?.toLowerCase() === parent.user.email.toLowerCase());
        if (authUser) {
          await supabaseAdmin.auth.admin.deleteUser(authUser.id);
        }
      }
    } catch (authErr) {
      console.error("Error deleting auth user:", authErr);
      // Proceed with database deletion even if auth deletion fails
    }

    // Delete the User record in database (cascades to Parent, Student, etc.)
    await prisma.user.delete({
      where: { id: parent.userId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete parent" }, { status: 500 });
  }
}
