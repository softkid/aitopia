import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(req: NextRequest) {
  try {
    const { serviceKey, amount, currency = 'krw' } = await req.json()

    let paymentAmount = amount

    // 금액이 제공되지 않은 경우 서비스 API에서 가져오기
    if (!paymentAmount) {
      try {
        const servicesResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/services`)
        const servicesData = await servicesResponse.json()
        
        if (servicesData.success) {
          const service = servicesData.services.find((s: any) => s.key === serviceKey)
          if (service && service.costKrw) {
            paymentAmount = service.costKrw
          }
        }
      } catch (fetchError) {
        console.log('서비스 가격 조회 실패, 기본값 사용')
      }
    }

    // 기본 가격 (백업)
    if (!paymentAmount) {
      const defaultPrices: { [key: string]: number } = {
        'nft-creator': 159000,
        'online-sales': 89000,
        'app-dev': 129000,
        'memecoin': 69000,
        'advertising': 49000,
        'music': 39000
      }
      paymentAmount = defaultPrices[serviceKey] || 50000
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentAmount,
      currency: currency,
      metadata: {
        serviceKey: serviceKey,
        description: `AITOPIA AI 서비스 가입: ${serviceKey}`
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentAmount
    })
  } catch (err: any) {
    console.error('Stripe error:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Stripe Payment Intent API' })
} 