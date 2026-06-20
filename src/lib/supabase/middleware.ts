import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: any }>) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  // Protected routes
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isParentRoute = request.nextUrl.pathname.startsWith("/parent");
  const isTeacherRoute = request.nextUrl.pathname.startsWith("/teacher");
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");

  if (!user && (isAdminRoute || isParentRoute || isTeacherRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    const role = user.user_metadata?.role || "PARENT";

    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      if (role === "ADMIN") {
        url.pathname = "/admin";
      } else if (role === "TEACHER") {
        url.pathname = "/teacher";
      } else {
        url.pathname = "/parent";
      }
      return NextResponse.redirect(url);
    }

    // Role-based route enforcement
    if (isAdminRoute && role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = role === "TEACHER" ? "/teacher" : "/parent";
      return NextResponse.redirect(url);
    }

    if (isTeacherRoute && role !== "TEACHER") {
      const url = request.nextUrl.clone();
      url.pathname = role === "ADMIN" ? "/admin" : "/parent";
      return NextResponse.redirect(url);
    }

    if (isParentRoute && role !== "PARENT") {
      const url = request.nextUrl.clone();
      url.pathname = role === "ADMIN" ? "/admin" : "/teacher";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
