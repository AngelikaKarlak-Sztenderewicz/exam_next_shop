import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const body = await req.json();
  const { firstName, email, phone, password, country } = body;

  if (!firstName || !email || !phone || !password || !country) {
    return NextResponse.json(
      { error: 'MISSING_FIELDS' },
      { status: 400 }
    );
  }

  const emailExists = await prisma.user.findUnique({
    where: { email },
  });

  if (emailExists) {
    return NextResponse.json(
      { error: 'EMAIL_EXISTS' },
      { status: 409 }
    );
  }

  const phoneExists = await prisma.user.findUnique({
    where: { phone },
  });

  if (phoneExists) {
    return NextResponse.json(
      { error: 'PHONE_EXISTS' },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      firstName,
      email,
      phone,
      password: hashedPassword,
      country,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
