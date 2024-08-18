import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import { NextAuthConfig } from "next-auth";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { firestore } from "./lib/firebase";
import Credentials from "next-auth/providers/credentials";

const authOptions: NextAuthConfig = {
  adapter: FirestoreAdapter({ namingStrategy: "snake_case", firestore }),
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize({ email, password }) {
        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
          throw new Error("Invalid credentials");
        }
        try {
          const usersCollection = firestore.collection("users");
          const userSnapshot = await usersCollection
            .where("email", "==", email)
            .limit(1)
            .get();

          if (userSnapshot.empty) {
            throw new Error("No user found with the provided email");
          }

          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();

          const isPasswordValid = await bcrypt.compare(
            password,
            userData.password
          );
          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: userDoc.id,
            username: userData.username,
            email: userData.email,};
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
    Google,
    GitHub,
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
