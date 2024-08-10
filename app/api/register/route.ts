import bcrypt from "bcrypt";
import { z } from "zod";
import {firestore} from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";

const userRegisterValidation = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

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
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await firestore.collection("users").add({
      name,
      email,
      password: hashedPassword,
    })
    return NextResponse.json(user, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 500,
    });
  }
}
