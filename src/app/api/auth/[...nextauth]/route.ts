import NextAuth, { type AuthOptions, type Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import type { JWT } from "next-auth/jwt";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email or phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) return null;

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { phone: credentials.identifier },
            ],
          },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.firstName,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.sub) {
        session.user.id = Number(token.sub);
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: { id: string } }) {
      if (user) token.sub = user.id;
      return token;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
