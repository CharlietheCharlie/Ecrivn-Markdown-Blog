import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
    const { name } = params;

    const userSnapshot = await firestore.collection("users").where("name_lowercase", "==", name?.toLowerCase()).limit(1).get();
    if (userSnapshot.empty) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const userDoc = userSnapshot.docs[0];
    const userId = userDoc.id; 

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "5", 10));


    let postsQuery = firestore
        .collection("posts")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .limit(limit);

    if (page > 1) {
        const previousPostsSnapshot = await firestore
            .collection("posts")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .limit((page - 1) * limit)
            .get();

        const lastVisible = previousPostsSnapshot.docs[previousPostsSnapshot.docs.length - 1];
        if (lastVisible) {
            postsQuery = postsQuery.startAfter(lastVisible);
        }
    }

    const postsSnapshot = await postsQuery.get();

    const posts = postsSnapshot.docs.map(doc => {
        const data = doc.data();
        const processedContent = data.content
            .replace(/\\\\/g, '\\') 
            .replace(/\\n/g, '\n'); 
        
        return { id: doc.id, ...data, content: processedContent };
    });

    return NextResponse.json(posts, { status: 200 });
}

export async function POST(request: NextRequest, { params }: { params: { name: string } }) {
    const { name } = params;
  
    const body = await request.json();
  
    if (!body.content) {
      return NextResponse.json({ message: "Content is required" }, { status: 400 });
    }
  
    const usersCollection = firestore.collection("users");
    const userSnapshot = await usersCollection.where("name_lowercase", "==", name?.toLowerCase()).limit(1).get();
  
    if (userSnapshot.empty) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  
    const userDoc = userSnapshot.docs[0];
    const userId = userDoc.id; 
  
    const postRef = firestore.collection("posts").doc();
    const postId = postRef.id;  
  
    await postRef.set({
      id: postId,
      userId,
      content: body.content,
      createdAt: new Date().toISOString(),
    });
  
    return NextResponse.json({ success: true, postId });
  }
  