import { ProductFormValidator } from '@/lib/validators/product';
import { prisma } from '@/server/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

type ProductCreateProps = {
  params: { storeId: string }
}

export async function GET(req: Request, { params }: ProductCreateProps) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') ?? undefined
    const colorId = searchParams.get('colorId') ?? undefined
    const sizeId = searchParams.get('sizeId') ?? undefined
    const isFeatured = searchParams.get('isFeatured')

    const { storeId } = params
    const products = await prisma.product.findMany({
      where: {
        storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)

  } catch (error) {
    console.log('[PRODUCTS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function POST(req: Request, { params }: ProductCreateProps) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const body = await req.json() as unknown;

    const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = ProductFormValidator.parse(body)
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

    const product = await prisma.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId,
        images: {
          createMany: {
            data: [
              ...images
            ]
          }
        }
      }
    })

    return NextResponse.json(product)

  } catch (error) {
    console.log('[PRODUCTS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}