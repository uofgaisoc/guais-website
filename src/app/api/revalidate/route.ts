
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{ _type: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    )

    if (!isValidSignature) {
      const message = 'Invalid signature'
      return new Response(JSON.stringify({ message, body }), { status: 401 })
    }

    if (!body?._type) {
      const message = 'Bad Request: Missing _type in body'
      return new Response(message, { status: 400 })
    }

    // Revalidate the tag associated with the changed document type
    revalidateTag(body._type)

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    })
  } catch (err: unknown) {
    // Keep the error type-safe: narrow unknown to Error when possible,
    // otherwise stringify the value so we can return a useful message.
    console.error(err)
    const message = err instanceof Error ? err.message : String(err)
    return new Response(message, { status: 500 })
  }
}