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
        return NextResponse.redirect(new URL(`/location/${location.qrSlug.replace('loc-', '')}`, request.url))
      }
    }

    // If no location found for this plaqueId, or it has no slug
    return NextResponse.rewrite(new URL('/not-found', request.url))
  } catch (error) {
    console.error(`Error looking up location with plaqueId ${plaqueId}:`, error)
    return NextResponse.rewrite(new URL('/not-found', request.url))
  }
}
