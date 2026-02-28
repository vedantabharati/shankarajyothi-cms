import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Location } from '@/payload-types'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const idStr = resolvedParams.id
  
  if (!idStr || isNaN(Number(idStr))) {
    return NextResponse.rewrite(new URL('/not-found', request.url))
  }

  const plaqueId = parseInt(idStr, 10)
  const payload = await getPayload({ config })

  try {
    const result = await payload.find({
      collection: 'locations',
      where: {
        plaqueId: { equals: plaqueId }
      },
      limit: 1,
    })

    if (result.docs.length > 0) {
      const location = result.docs[0] as Location
      if (location.qrSlug) {
        // We found the location and it has a slug, redirect to its page
        const redirectUrl = new URL(`/location/${location.qrSlug.replace('loc-', '')}`, request.url)
        // Force the host to match the incoming request headers to avoid 0.0.0.0 issues behind proxies
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
        const protocol = request.headers.get('x-forwarded-proto') || 'https'
        
        if (host) {
          redirectUrl.host = host
          redirectUrl.protocol = protocol
        }
        
        return NextResponse.redirect(redirectUrl)
      }
    }

    // If no location found for this plaqueId, or it has no slug
    return NextResponse.redirect(new URL('/not-found', request.url))
  } catch (error) {
    console.error(`Error looking up location with plaqueId ${plaqueId}:`, error)
    return NextResponse.redirect(new URL('/not-found', request.url))
  }
}
