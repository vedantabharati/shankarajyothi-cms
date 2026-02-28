import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Location } from '@/payload-types'

function getAbsoluteUrl(request: Request, path: string) {
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'shaankarajyoti.vedantabharati.org'
  return `${protocol}://${host}${path}`
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const idStr = resolvedParams.id
  
  if (!idStr || isNaN(Number(idStr))) {
    return NextResponse.redirect(getAbsoluteUrl(request, '/location'))
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
        return NextResponse.redirect(getAbsoluteUrl(request, `/location/${location.qrSlug.replace('loc-', '')}`))
      }
    }

    return NextResponse.redirect(getAbsoluteUrl(request, '/location'))
  } catch (error) {
    console.error(`Error looking up location with plaqueId ${plaqueId}:`, error)
    return NextResponse.redirect(getAbsoluteUrl(request, '/location'))
  }
}

