import webpush from "web-push";
import { prisma } from "@/lib/prisma";

// Configure VAPID details
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

let isPushConfigured = false;
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(
      "mailto:admin@nhatrehami.com",
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );
    isPushConfigured = true;
  } catch (error) {
    console.error("Failed to configure Web-push VAPID details:", error);
  }
} else {
  console.warn("Web-push configuration skipped: VAPID keys are missing.");
}

export { webpush };

/**
 * Send push notification to all subscribed users (or filtered by userIds)
 */
export async function sendPushToUsers(
  payload: {
    title: string;
    body: string;
    icon?: string;
    url?: string;
    tag?: string;
    announcementId?: string;
  },
  userIds?: string[]
) {
  if (!isPushConfigured) {
    console.error("Cannot send push notification: VAPID details are not configured.");
    return { sent: 0, failed: 0 };
  }
  try {
    const where = userIds ? { userId: { in: userIds } } : {};
    const subscriptions = await prisma.pushSubscription.findMany({ where });

    if (subscriptions.length === 0) return { sent: 0, failed: 0 };

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            JSON.stringify(payload)
          );
        } catch (error: any) {
          // If subscription is expired or invalid, remove it
          if (error.statusCode === 404 || error.statusCode === 410) {
            await prisma.pushSubscription.delete({
              where: { id: sub.id },
            }).catch(() => {});
          }
          throw error;
        }
      })
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return { sent, failed };
  } catch (error) {
    console.error("Push notification error:", error);
    return { sent: 0, failed: 0 };
  }
}

/**
 * Send push notification to all parents (optionally filtered by class)
 */
export async function sendPushToParents(
  payload: {
    title: string;
    body: string;
    icon?: string;
    url?: string;
    tag?: string;
    announcementId?: string;
  },
  targetClass?: string | null
) {
  try {
    // Find all parent user IDs, optionally filtered by class
    let parentUserIds: string[];

    if (targetClass) {
      // Find parents whose children are in the target class
      const parents = await prisma.parent.findMany({
        where: {
          students: { some: { className: targetClass } },
        },
        select: { userId: true },
      });
      parentUserIds = parents.map((p) => p.userId);
    } else {
      // All parents
      const parents = await prisma.parent.findMany({
        select: { userId: true },
      });
      parentUserIds = parents.map((p) => p.userId);
    }

    if (parentUserIds.length === 0) return { sent: 0, failed: 0 };

    return await sendPushToUsers(payload, parentUserIds);
  } catch (error) {
    console.error("Push to parents error:", error);
    return { sent: 0, failed: 0 };
  }
}
