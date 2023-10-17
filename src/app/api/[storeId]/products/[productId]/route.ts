import { ProductFormValidator } from '@/lib/validators/product';
import { prisma } from '@/server/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

type ProductProps = {
  params: {
    storeId: string,
    productId: string
  }
}

export async function GET(_req: Request, { params }: ProductProps) {
  try {
    const { productId } = params
    if (!productId) {
      return new NextResponse('Product Id is required', { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: ProductProps) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const { storeId } = params
    if (!storeId) {
      return new NextResponse('Store Id is required', { status: 400 })
    }

    const { productId } = params
    if (!productId) {
      return new NextResponse('Product Id is required', { status: 400 })
    }

    const body = await req.json() as unknown;
    const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = ProductFormValidator.parse(body)

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    })
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {}
        },
        isFeatured,
        isArchived,
      }
    })

    const product = await prisma.product.update({
      where: {
        id: productId
      },
      data: {
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
    console.log('[PRODUCT_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: ProductProps) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { storeId } = params
    if (!storeId) {
      return new NextResponse('Store Id is required', { status: 400 })
    }

    const { productId } = params
    if (!productId) {
      return new NextResponse('Product Id is required', { status: 400 })
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

    const product = await prisma.product.deleteMany({
      where: {
        id: productId,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}