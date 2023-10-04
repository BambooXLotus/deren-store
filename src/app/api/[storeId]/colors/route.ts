import { ColorFormValidator } from '@/lib/validators/color';
import { prisma } from '@/server/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

type BillboardCreateProps = {
  params: { storeId: string }
}

export async function GET(_req: Request, { params }: BillboardCreateProps) {
  try {
    const { storeId } = params
    const colors = await prisma.color.findMany({
      where: {
        storeId
      }
    })

    return NextResponse.json(colors)

  } catch (error) {
    console.log('[COLORS_GET]', error)
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

    const { name, value } = ColorFormValidator.parse(body)
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

    const color = await prisma.color.create({
      data: {
        name,
        value,
        storeId
      }
    })

    return NextResponse.json(color)

  } catch (error) {
    console.log('[COLORS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}