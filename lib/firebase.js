import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyApFUdAxjm_ULu9k0QiKcYwjXiywF7uBiQ",
  authDomain: "next-mdx-blog-8a2bf.firebaseapp.com",
  projectId: "next-mdx-blog-8a2bf",
  storageBucket: "next-mdx-blog-8a2bf.appspot.com",
  messagingSenderId: "499500282420",
  appId: "1:499500282420:web:38007a05bdd21f6ed25061",
  measurementId: "G-S2K882SNN3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);



