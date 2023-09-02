import { StoreValidator } from '@/lib/validators/store';
import { prisma } from '@/server/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function Post(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json() as unknown;

    const { name } = StoreValidator.parse(body)

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

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