'use client'

import { Sheet } from '@/components/ui/sheet'
import { useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useState } from 'react'

export function ClientSheet({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(true)
	const router = useRouter()
	const searchParams = useSearchParams()

	return (
		<Sheet
			open={isOpen}
			onOpenChange={open => {
				if (open) return

				setIsOpen(false)
				setTimeout(() => {
					router.push(`/?${searchParams.toString()}`, { scroll: false })
				}, 150)
			}}
			modal
		>
			{children}
		</Sheet>
	)
}
