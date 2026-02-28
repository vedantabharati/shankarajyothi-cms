import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
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
    redirect('/location')
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
        // We found the location and it has a slug, redirect to its page natively
        redirect(`/location/${location.qrSlug.replace('loc-', '')}`)
      }
    }

    // If no location found for this plaqueId, or it has no slug
    redirect('/location')
  } catch (error) {
    console.error(`Error looking up location with plaqueId ${plaqueId}:`, error)
    redirect('/location')
  }
}

