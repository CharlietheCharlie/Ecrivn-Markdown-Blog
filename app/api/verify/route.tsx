import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';

export async function GET(request: NextRequest) {
    try {
        const token = request.nextUrl.searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 400 });
        }

    
        const userSnapshot = await firestore.collection("users").where("verificationToken", "==", token).get();

        if (userSnapshot.empty) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        if (Date.now() > userData.tokenExpires) {
            return NextResponse.json({ error: 'Token expired' }, { status: 400 });
        }

        await firestore.collection("users").doc(userDoc.id).update({
            active: true,
            verificationToken: null, 
            tokenExpires: null,  
        });

        return NextResponse.json({ message: 'User successfully verified and activated' });

    } catch (error) {
        console.error('Error verifying user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
