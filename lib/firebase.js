import { initFirestore } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";


const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

export const firestore = initFirestore({
  credential: cert({
    ...firebaseConfig,
  }),
});
