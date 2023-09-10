import { StoreEditValidator } from "@/lib/validators/store"
import { prisma } from "@/server/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

type StoreEditProps = {
  params: { storeId: string }
}

export async function PATCH(req: Request, { params }: StoreEditProps) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store Id is required', { status: 400 })
    }

    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    const body = await req.json() as unknown;

    const { name } = StoreEditValidator.parse(body)

    //I dont think I need this since I'm using a validator to parse
    // if (!name) {
    //   return new NextResponse('Name is required', { status: 400 })
    // }

    const store = await prisma.store.updateMany({
      where: {
        id: params.storeId,
        userId
      },
      data: {
        name
      }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORE_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: StoreEditProps) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store Id is required', { status: 400 })
    }

    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const store = await prisma.store.deleteMany({
      where: {
        id: params.storeId,
        userId
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORE_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}