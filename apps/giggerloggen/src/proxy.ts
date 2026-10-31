import { NextRequest, NextResponse } from "next/server";

// Snabb kontroll av om sessionskakan finns. Den riktiga sessionskontrollen
// görs på varje sida och i varje server action.
function hasSessionCookie(request: NextRequest) {
  return Boolean(
    request.cookies.get("better-auth.session_token") ??
      request.cookies.get("__Secure-better-auth.session_token"),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = hasSessionCookie(request);

  // Inloggad på startsidan → direkt till mina sidor.
  if (pathname === "/") {
    if (!loggedIn) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/mina-sidor";
    return NextResponse.redirect(url);
  }

  // Skyddade sidor kräver inloggning.
  if (!loggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/logga-in";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/mina-sidor/:path*", "/admin/:path*", "/admin"],
};
