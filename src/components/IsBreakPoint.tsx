'use client'

import { ReactNode, useSyncExternalStore } from 'react'

export function IsBreakpoint({
	breakpoint,
	children,
	otherwise,
}: {
	breakpoint: string
	children: ReactNode
	otherwise?: ReactNode
}) {
	const isBreakpoint = useIsBreakpoint(breakpoint)
	return isBreakpoint ? children : otherwise
}

function useIsBreakpoint(breakpoint: string) {
	const query = `(${breakpoint})`

	return useSyncExternalStore(
		// 1. Підписка на події зміни медіа-запиту
		callback => {
			const media = window.matchMedia(query)
			media.addEventListener('change', callback)
			return () => media.removeEventListener('change', callback)
		},
		// 2. Отримання поточного значення на клієнті
		() => window.matchMedia(query).matches,
		// 3. Значення за замовчуванням для сервера (SSR / Hydration)
		() => false
	)
}
