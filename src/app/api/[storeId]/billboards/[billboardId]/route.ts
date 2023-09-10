import { BillboardFormValidator } from '@/lib/validators/billboard';
import { prisma } from '@/server/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

type BillboardProps = {
  params: {
    storeId: string,
    billboardId: string
  }
}

export async function GET(_req: Request, { params }: BillboardProps) {
  try {
    const { billboardId } = params
    if (!billboardId) {
      return new NextResponse('Billboard Id is required', { status: 400 })
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: billboardId,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: BillboardProps) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { storeId } = params
    if (!storeId) {
      return new NextResponse('Store Id is required', { status: 400 })
    }

    const { billboardId } = params
    if (!billboardId) {
      return new NextResponse('Billboard Id is required', { status: 400 })
    }

    const body = await req.json() as unknown;
    const { label, imageUrl } = BillboardFormValidator.parse(body)

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const billboard = await prisma.billboard.updateMany({
      where: {
        id: billboardId,
      },
      data: {
        label,
        imageUrl
      }
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: BillboardProps) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { storeId } = params
    if (!storeId) {
      return new NextResponse('Store Id is required', { status: 400 })
    }

    const { billboardId } = params
    if (!billboardId) {
      return new NextResponse('Billboard Id is required', { status: 400 })
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const billboard = await prisma.billboard.deleteMany({
      where: {
        id: billboardId,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}