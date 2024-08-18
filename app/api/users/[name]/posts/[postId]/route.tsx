import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";

export async function GET(req: NextRequest, params: { params: { postId?: string } }) {
    const { postId } = params.params;
    if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const postSnapshot = await firestore.collection('posts').doc(postId).get();
    if (!postSnapshot.exists) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const postData = postSnapshot.data();
    if (!postData) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const processedContent = postData.content
    .replace(/\\\\/g, '\\') 
    .replace(/\\n/g, '\n'); 

    return NextResponse.json({ content: processedContent });
}

export async function PUT(req: NextRequest, params: { params: { postId?: string } }) {
    const { postId } = params.params;
    const body = await req.json();

    if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const postRef = firestore.collection('posts').doc(postId);
    const postSnapshot = await postRef.get();
    if (!postSnapshot.exists) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await postRef.update({
        content: body.content
    });

    return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest, params: { params: { userName?: string } }) {
    const { userName } = params.params;
    const { title, content } = await req.json();

    if (!userName || !title || !content) {
        return NextResponse.json({ error: 'User name, title, and content are required' }, { status: 400 });
    }

    const postRef = firestore.collection('posts').doc();
    await postRef.set({
        userName,
        title,
        content,
        createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
}