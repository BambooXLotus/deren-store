import { SizeFormValidator } from '@/lib/validators/size';
import { prisma } from '@/server/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

type BillboardCreateProps = {
  params: { storeId: string }
}

export async function GET(_req: Request, { params }: BillboardCreateProps) {
  try {
    const { storeId } = params
    const sizes = await prisma.size.findMany({
      where: {
        storeId
      }
    })

    return NextResponse.json(sizes)

  } catch (error) {
    console.log('[SIZES_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function POST(req: Request, { params }: BillboardCreateProps) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const body = await req.json() as unknown;

    const { name, value } = SizeFormValidator.parse(body)
    const { storeId } = params

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const size = await prisma.size.create({
      data: {
        name,
        value,
        storeId
      }
    })

    return NextResponse.json(size)

  } catch (error) {
    console.log('[SIZES_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}