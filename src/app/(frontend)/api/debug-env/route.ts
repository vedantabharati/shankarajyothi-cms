import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasPayloadSecret: !!process.env.PAYLOAD_SECRET,
    secretLength: process.env.PAYLOAD_SECRET?.length ?? 0,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasS3Bucket: !!process.env.S3_BUCKET,
    nodeEnv: process.env.NODE_ENV,
  })
}
