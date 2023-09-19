import { CategoryFormValidator } from '@/lib/validators/category';
import { prisma } from '@/server/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

type CategoryProps = {
  params: {
    storeId: string,
    categoryId: string
  }
}

export async function GET(_req: Request, { params }: CategoryProps) {
  try {
    const { categoryId } = params
    if (!categoryId) {
      return new NextResponse('Category Id is required', { status: 400 })
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: CategoryProps) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { storeId } = params
    if (!storeId) {
      return new NextResponse('Store Id is required', { status: 400 })
    }

    const { categoryId } = params
    if (!categoryId) {
      return new NextResponse('Category Id is required', { status: 400 })
    }

    const body = await req.json() as unknown;
    const { name, billboardId } = CategoryFormValidator.parse(body)

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const category = await prisma.category.updateMany({
      where: {
        id: categoryId,
      },
      data: {
        name,
        billboardId
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: CategoryProps) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { storeId } = params
    if (!storeId) {
      return new NextResponse('Store Id is required', { status: 400 })
    }

    const { categoryId } = params
    if (!categoryId) {
      return new NextResponse('Category Id is required', { status: 400 })
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

    const category = await prisma.category.deleteMany({
      where: {
        id: categoryId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}