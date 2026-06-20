import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Get the currently authenticated user from local Supabase session (high speed, no network call)
 * and fetch their profile from the database.
 */
export async function getAuthenticatedUser() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;
    if (!user) return null;

    return await prisma.user.findUnique({
      where: { email: user.email! },
      include: {
        parent: {
          include: { students: true }
        },
        teacher: true,
      },
    });
  } catch (error) {
    console.error("Error in getAuthenticatedUser:", error);
    return null;
  }
}
