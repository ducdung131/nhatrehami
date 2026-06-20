import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { sendPushToParents } from "@/lib/web-push";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return await prisma.user.findUnique({
    where: { email: user.email! },
  });
}

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      include: { createdBy: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    console.log(`[API Announcements POST] Supabase user: ${user ? user.email : "none"}`);

    const currentUser = await getAuthenticatedUser();
    console.log(`[API Announcements POST] Prisma user: ${currentUser ? currentUser.email : "not found"}, Role: ${currentUser ? currentUser.role : "none"}`);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Tiêu đề và nội dung là bắt buộc" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: body.title,
        content: body.content,
        targetClass: body.targetClass || null,
        createdById: currentUser.id,
      },
    });

    // Send push notification to parents
    try {
      const pushResult = await sendPushToParents(
        {
          title: `🔔 ${body.title}`,
          body: body.content.length > 120
            ? body.content.substring(0, 120) + "..."
            : body.content,
          icon: "/icon.png",
          url: "/parent/notifications",
          tag: `announcement-${announcement.id}`,
          announcementId: announcement.id,
        },
        body.targetClass || null
      );
      console.log(`Push notifications sent: ${pushResult.sent} success, ${pushResult.failed} failed`);
    } catch (pushError) {
      // Don't fail the announcement creation if push fails
      console.error("Failed to send push notifications:", pushError);
    }

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
