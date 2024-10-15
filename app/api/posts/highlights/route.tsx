import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "5", 10));

    let postsQuery = firestore
        .collection("posts")
        .orderBy("createdAt", "desc")
        .limit(limit);

    if (page > 1) {
        const previousPostsSnapshot = await firestore
            .collection("posts")
            .orderBy("createdAt", "desc")
            .limit((page - 1) * limit)
            .get();

        const lastVisible = previousPostsSnapshot.docs[previousPostsSnapshot.docs.length - 1];
        if (lastVisible) {
            postsQuery = postsQuery.startAfter(lastVisible);
        }
    }

    const postsSnapshot = await postsQuery.get();


    const posts = await Promise.all(postsSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const userSnapshot = await firestore.collection('users').doc(data.userId).get();
        const userData = userSnapshot.data();
        const userName = userData?.name || 'Unknown';
        const userImage = userData?.image || null;  
        return {
            id: doc.id,
            ...data,
            userName,
            userImage,  
            content: data.content.replace(/\\\\/g, '\\').replace(/\\n/g, '\n'),
        };
    }));


    return NextResponse.json(posts, { status: 200 });
}
