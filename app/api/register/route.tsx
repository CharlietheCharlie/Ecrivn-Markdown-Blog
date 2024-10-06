import bcrypt from "bcrypt";
import { firestore } from "@/lib/firebase";
import schema from "./schema";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';
import RegistrationTemplate from '@/emails/RegistrationTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);
const TOKEN_EXPIRATION_TIME = 3600 * 1000; 

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

  try {
    const emailExist = await firestore.collection("users").where("email", "==", email).get();
    if (emailExist.size > 0) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const nameExist = await firestore.collection("users").where("name", "==", name).get();
    if (nameExist.size > 0) {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = firestore.collection("users").doc();
    const uid = userRef.id;

    const token = uuidv4();
    const verificationLink = `${process.env.NEXT_PUBLIC_API_URL}                      /api/verify                                                     ?token=${token}`;  

    await firestore.collection("users").doc(uid).set({
      id: uid,
      name,
      email,
      password: hashedPassword,
      active: false, 
      verificationToken: token,
      tokenExpires: Date.now() + TOKEN_EXPIRATION_TIME, 
      createdAt: new Date(),
    });

    try{
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Please verify your email',
        react: <RegistrationTemplate name={name} verificationLink={verificationLink} />,
      });  
    }catch(error){
      console.error('Error sending verification email:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Registration successful, verification email sent.' }, { status: 201 });

  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
