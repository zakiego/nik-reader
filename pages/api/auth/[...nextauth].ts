import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        secretCode: { label: "SecretCode", type: "password" },
      },
      async authorize(credentials) {
        const user = {
          id: "1",
          name: "SUPERADMIN",
        };

        if (credentials.secretCode === process.env.SECRET_CODE) {
          return user;
        }

        return null;
      },
    }),
  ],
};
export default NextAuth(authOptions);
