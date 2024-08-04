import { NextRequest, NextResponse } from "next/server";
import schema from "@/app/api/users/schema";

export async function GET(request: NextRequest) {
    const users = await {}.user.findMany({
        where: {

        }
    });
    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    const validation = schema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 });
    }
    const user = await {}.user.findUnique({
        where:{email:body.email}
    })
    if(user){
        return NextResponse.json("user already exist!", { status: 400 });

    }
    const newUser = await {}.user.create({
        data: {
            name: body.name,
            email: body.email
        }
    })
    return NextResponse.json(newUser, { status: 201 });
}