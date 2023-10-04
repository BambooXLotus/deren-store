import { ColorFormValidator } from '@/lib/validators/color';
import { prisma } from '@/server/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

type ColorRouteProps = {
  params: {
    storeId: string,
    colorId: string
  }
}

export async function GET(_req: Request, { params }: ColorRouteProps) {
  try {
    const { colorId } = params
    if (!colorId) {
      return new NextResponse('Color Id is required', { status: 400 })
    }

    const color = await prisma.color.findUnique({
      where: {
        id: colorId,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: ColorRouteProps) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { storeId } = params
    if (!storeId) {
      return new NextResponse('Store Id is required', { status: 400 })
    }

    const { colorId } = params
    if (!colorId) {
      return new NextResponse('Color Id is required', { status: 400 })
    }

    const body = await req.json() as unknown;
    const { name, value } = ColorFormValidator.parse(body)

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const color = await prisma.color.updateMany({
      where: {
        id: colorId,
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: ColorRouteProps) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { storeId } = params
    if (!storeId) {
      return new NextResponse('Store Id is required', { status: 400 })
    }

    const { colorId } = params
    if (!colorId) {
      return new NextResponse('Color Id is required', { status: 400 })
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

    const color = await prisma.color.deleteMany({
      where: {
        id: colorId,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}