'use client'

import { useIsDarkMode } from '@/hooks/useIsDarkMode'
import { ClerkProvider as OriginalClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { ReactNode } from 'react'

export function ClerkProvider({ children }: { children: ReactNode }) {
	const isDarkMode = useIsDarkMode()

	return (
		// <Suspense>
		<OriginalClerkProvider appearance={isDarkMode ? dark : undefined}>
			{children}
		</OriginalClerkProvider>
		// </Suspense>
	)
}
