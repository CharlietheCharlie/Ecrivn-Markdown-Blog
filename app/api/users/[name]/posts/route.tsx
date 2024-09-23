import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";

export async function GET(request: NextRequest, {params}: { params: { name: string } }) {
    const { name } = params;

    const userSnapshot = await firestore.collection("users").where("name", "==", name).get();

    if (userSnapshot.empty) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userDoc = userSnapshot.docs[0];
    const uid = userDoc.data().id;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    let postsQuery = firestore
        .collection("posts")
        .where("userId", "==", uid)
        .orderBy("createdAt", "desc")
        .limit(limit);

    if (page > 1) {
        const previousPostsSnapshot = await firestore
            .collection("posts")
            .where("userId", "==", uid)
            .orderBy("createdAt", "desc")
            .limit((page - 1) * limit)
            .get();

        const lastVisible = previousPostsSnapshot.docs[previousPostsSnapshot.docs.length - 1];
        postsQuery = postsQuery.startAfter(lastVisible);
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
