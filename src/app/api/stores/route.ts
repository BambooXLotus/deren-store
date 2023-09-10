import { StoreCreateValidator } from '@/lib/validators/store';
import { prisma } from '@/server/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const body = await req.json() as unknown;

    const { name } = StoreCreateValidator.parse(body)

    const store = await prisma.store.create({
      data: {
        name,
        userId
      }
    })

    return NextResponse.json(store)

  } catch (error) {
    console.log('[STORES_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}