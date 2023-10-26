import { prisma } from '@/server/db';
import type Stripe from 'stripe'

import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'
import { CheckoutValidator } from '@/lib/validators/checkout';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': "GET, POST, PUT, DELETE, OPTIONS",
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

export function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

type CheckoutPostParams = {
  params: { storeId: string }
}

export async function POST(req: Request, { params }: CheckoutPostParams) {

  const body = await req.json() as unknown;

  const { productIds } = CheckoutValidator.parse(body)

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 })
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  })

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: product.name
        },
        unit_amount: product.price.toNumber() * 100
      }
    })
  })

  const { storeId } = params

  const order = await prisma.order.create({
    data: {
      storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId) => ({
          product: {
            connect: {
              id: productId
            }
          }
        }))
      }
    }
  })

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true
    },
    success_url: `${process.env.SHOP_URL}/cart?success=1`,
    cancel_url: `${process.env.SHOP_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id
    }
  })

  return NextResponse.json({ url: session.url }, { headers: corsHeaders })
}