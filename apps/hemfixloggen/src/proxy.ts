// Matcher-configen måste stå här (Next läser den statiskt). Logiken är delad.
export { proxy } from "@knegarloggen/app/proxy";

export const config = {
  matcher: ["/", "/mina-sidor/:path*", "/admin/:path*", "/admin"],
};
