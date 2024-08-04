import fs from 'fs';
import { NextRequest, NextResponse } from "next/server";

const MDX_ROOT_DIR = './public/articles';

export async function GET(req: NextRequest, params: { params: { postId?: string } }) {
    const { postId } = params.params;
   
    const filePath = `${MDX_ROOT_DIR}/article${postId}.md`;
    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json({ content });
}

export async function PUT(req: NextRequest, params: { params: { postId?: string } }) {
    const { postId } = params.params;
    const body = await req.json();
    const filePath = `${MDX_ROOT_DIR}/article${postId}.md`;
    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    fs.writeFileSync(filePath, body.content);
    return NextResponse.json({ success: true });
}