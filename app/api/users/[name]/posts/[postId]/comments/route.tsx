import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";
export async function GET(req: NextRequest, params: { params: { postId?: string } }) {
    const { postId } = params.params;
    if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }
    const commentsSnapshot = await firestore.collection('comments').where('postId', '==', postId).get();
    const comments = commentsSnapshot.docs.map((doc) => doc.data());
    return NextResponse.json({ comments });
}

export async function POST(req: NextRequest, params: { params: { postId?: string } }) {
    const { postId } = params.params;
    if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }
    const body = await req.json();
    if (!body.content) {
        return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const commentRef = firestore.collection('comments').doc();
    await commentRef.set({
        postId,
        content: body.content,
        userName: body.userName,
        createdAt: new Date().toISOString(),
    });

    const postRef = firestore.collection('posts').doc(postId);
    await postRef.update({
        commentCount: FieldValue.increment(1),
    })
    const comment = await commentRef.get();
    const commentData = comment.data();

    if (!commentData) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({
        id: commentRef.id,
        ...commentData
    });
}

export async function PUT(req: NextRequest, params: { params: { postId?: string } }) {
    const { postId } = params.params;
    if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }
    const body = await req.json();
    if (!body.commentId) {
        return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }
    await firestore.collection('comments').doc(body.commentId).update({
        content: body.content
    });
    return NextResponse.json({
        success: true,
    })
}

export async function DELETE(req: NextRequest, params: { params: { postId?: string } }) {
    const { postId } = params.params;
    if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }
    const body = await req.json();
    if (!body.commentId) {
        return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }
    await firestore.collection('comments').doc(body.commentId).delete();
    const postRef = firestore.collection('posts').doc(postId);
    await postRef.update({
        commentCount: FieldValue.increment(-1),
    })
    return NextResponse.json({
        success: true,
    })
}
