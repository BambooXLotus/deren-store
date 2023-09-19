import { CategoryFormValidator } from '@/lib/validators/category';
import { prisma } from '@/server/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

type CategoriesApiProps = {
  params: { storeId: string }
}

export async function GET(_req: Request, { params }: CategoriesApiProps) {
  try {
    const { storeId } = params
    const catagories = await prisma.category.findMany({
      where: {
        storeId
      }
    })

    return NextResponse.json(catagories)

  } catch (error) {
    console.log('[CATAGORIES_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function POST(req: Request, { params }: CategoriesApiProps) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const body = await req.json() as unknown;

    const { name, billboardId } = CategoryFormValidator.parse(body)
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

    const category = await prisma.category.create({
      data: {
        name,
        billboardId,
        storeId
      }
    })

    return NextResponse.json(category)

  } catch (error) {
    console.log('[CATAGORIES_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}