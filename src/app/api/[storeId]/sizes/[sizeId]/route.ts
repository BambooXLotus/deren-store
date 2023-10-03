import { SizeFormValidator } from '@/lib/validators/size';
import { prisma } from '@/server/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

type SizeProps = {
  params: {
    storeId: string,
    sizeId: string
  }
}

export async function GET(_req: Request, { params }: SizeProps) {
  try {
    const { sizeId } = params
    if (!sizeId) {
      return new NextResponse('Size Id is required', { status: 400 })
    }

    const size = await prisma.size.findUnique({
      where: {
        id: sizeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: SizeProps) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { storeId } = params
    if (!storeId) {
      return new NextResponse('Store Id is required', { status: 400 })
    }

    const { sizeId } = params
    if (!sizeId) {
      return new NextResponse('Size Id is required', { status: 400 })
    }

    const body = await req.json() as unknown;
    const { name, value } = SizeFormValidator.parse(body)

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const size = await prisma.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: SizeProps) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { storeId } = params
    if (!storeId) {
      return new NextResponse('Store Id is required', { status: 400 })
    }

    const { sizeId } = params
    if (!sizeId) {
      return new NextResponse('Size Id is required', { status: 400 })
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

    const size = await prisma.size.deleteMany({
      where: {
        id: sizeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}