import { BillboardFormValidator } from '@/lib/validators/billboard';
import { prisma } from '@/server/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

type BillboardCreateProps = {
  params: { storeId: string }
}

export async function GET(_req: Request, { params }: BillboardCreateProps) {
  try {
    const { storeId } = params
    const billboards = await prisma.billboard.findMany({
      where: {
        storeId
      }
    })

    return NextResponse.json(billboards)

  } catch (error) {
    console.log('[BILLBOARDS_GET]', error)
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

    const { label, imageUrl } = BillboardFormValidator.parse(body)
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

    const billboard = await prisma.billboard.create({
      data: {
        label,
        imageUrl,
        storeId
      }
    })

    return NextResponse.json(billboard)

  } catch (error) {
    console.log('[BILLBOARDS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}