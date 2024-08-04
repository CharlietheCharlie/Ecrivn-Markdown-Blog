import fs from 'fs';
import { NextRequest, NextResponse } from "next/server";

const MDX_ROOT_DIR = './public/articles';

export async function GET(req: NextRequest) {
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '5');


    try {
        const files = fs.readdirSync(MDX_ROOT_DIR);
        const startIndex = (page - 1) * limit;
        const selectedFiles = files.slice(startIndex, startIndex + limit);

        const articles = selectedFiles.map(file => {
            const content = fs.readFileSync(`${MDX_ROOT_DIR}/${file}`, 'utf-8');
            return { id: file.match(/(\d+)\.md$/)?.[1], content };
        });
        return NextResponse.json({ data:articles });
    } catch (error) {
        return NextResponse.json({ error: 'Unable to fetch articles' }, { status: 500 });
    }


}
