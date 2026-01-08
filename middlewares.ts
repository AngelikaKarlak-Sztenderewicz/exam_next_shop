import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware() {}, {
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;

      if (
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/register")
      ) {
        return true;
      }

      return !!token;
    },
  },
});

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
