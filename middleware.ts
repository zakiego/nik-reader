import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ req, token }) => {
      if (token) {
        return true;
      }
      return false;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico/).*)"],
};
