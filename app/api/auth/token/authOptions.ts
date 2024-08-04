import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";
import { db } from "@/lib/firebase";
import { getDocs, collection } from "firebase/firestore";

const authOptions: NextAuthOptions = {
  adapter: FirebaseAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const users = await getDocs(collection(db, "users"));
        const user = users.docs.find((doc) => {
          return doc.data().email === credentials.email;
        });
        if (!user) {
          return null;
        }
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.data().password
        );
        return passwordMatch ? user : null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

export { authOptions };
