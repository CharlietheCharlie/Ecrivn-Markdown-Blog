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
        if (
          !email ||
          !password ||
          typeof email !== "string" ||
          typeof password !== "string"
        ) {
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

          return userData;
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (["google", "github"].includes(account?.provider as string)) {
        const usersCollection = firestore.collection("users");
        const userSnapshotByEmail = await usersCollection
          .where("email", "==", user.email)
          .limit(1)
          .get();

        if (userSnapshotByEmail.empty) {
          let username = user.email?.split("@")[0];
          let isUnique = false;
          while (!isUnique) {
            const userSnapshotByName = await usersCollection
              .where("name", "==", username)
              .limit(1)
              .get();
            if (userSnapshotByName.empty) {
              isUnique = true;
            } else {
              username =
                (user.email?.split("@")[0] || "") +
                Math.floor(Math.random() * 10000);
            }
          }

          const userRef = usersCollection.doc();
          await usersCollection.add({
            email: user.email,
            name: username,
            id: userRef.id,
            image: user.image,
            createdAt: new Date(),
            providers: [account?.provider as string],
          });
        } else {
          const userDoc = userSnapshotByEmail.docs[0];
          const userData = userDoc.data();
          const providers = userData.providers || [];
          if (!providers.includes(account?.provider)) {
            await usersCollection.doc(userDoc.id).update({
              providers: [...providers, account?.provider],
            });
          }
        }
      }
      
      return true;
    },
    async session({ session }) {
      return session
    },
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
