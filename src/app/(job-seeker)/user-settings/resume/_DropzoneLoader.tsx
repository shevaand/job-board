'use client'

import dynamic from 'next/dynamic'

export const DropzoneClient = dynamic(
	() => import('./_DropzoneClient').then(mod => mod.DropzoneClient),
	{ ssr: false }
)
