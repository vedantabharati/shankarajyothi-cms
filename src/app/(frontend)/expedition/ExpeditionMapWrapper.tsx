'use client'

import dynamic from 'next/dynamic'
import type { Expedition } from '@/payload-types'

const ExpeditionMap = dynamic(() => import('./ExpeditionMap'), { ssr: false })

export default function ExpeditionMapWrapper({ expedition }: { expedition: Expedition }) {
  return <ExpeditionMap expedition={expedition} />
}
