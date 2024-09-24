import bcrypt from "bcrypt";
import { firestore } from "@/lib/firebase";
import schema from "./schema";
import { NextRequest, NextResponse } from "next/server";

const userRegisterValidation = schema;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = userRegisterValidation.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.issues, {
      status: 400,
    });
  }

  const { name, email, password } = validation.data;

  const emailExist = await firestore.collection("users").where("email", "==", email).get();
  if (emailExist.size > 0) {
    return NextResponse.json({ message: "Email already exists" }, {
      status: 400,
    });
  }

  const nameExist = await firestore.collection("users").where("name", "==", name).get();
  if (nameExist.size > 0) {
    return NextResponse.json({ message: "Username already exists" }, {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRef = firestore.collection("users").doc();
  const uid = userRef.id;

  try {
    const user = await firestore.collection("users").add({
      id: uid,
      name, 
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json(user, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
