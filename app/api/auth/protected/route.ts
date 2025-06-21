import { auth } from '@/utils/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(auth);
  if (session) {
    return NextResponse.json({ protected: true });
  } else {
    return NextResponse.json({ protected: false });
  }
}
