import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";
import schema from "../schema";


export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
    const { name } = params;

    const userSnapshot = await firestore.collection("users").where("name", "==", name).get();

    const user = userSnapshot.docs[0];

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user.data(), { status: 200 })
}


export async function PUT(
    request: NextRequest,
    { params }: { params: { name: string } }) {
    const { name } = params;
    const body = await request.json();
    const validation = schema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 })
    }
    const user = await firestore.collection("users").where("name", "==", name).get();
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const updatedUser = await firestore.collection("users").doc(user.docs[0].id).update(validation.data);
    return NextResponse.json(updatedUser, { status: 201 })

}


export async function DELETE(
    request: NextRequest,
    { params }: { params: { name: string } }) {
    const { name } = params;
    const user = await firestore.collection("users").where("name", "==", name).get();
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const deletedUser = await firestore.collection("users").doc(user.docs[0].id).delete();

    return NextResponse.json({});

}