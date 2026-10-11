'use client'

import { Input } from '@/components/ui/input'
import { ComponentProps, useCallback, useEffect, useRef, useState } from 'react'

export type Place = {
	city: string
	region: string | null
	countryCode: string
}

type GeoResult = {
	id: number
	name: string
	admin1?: string
	country_code?: string
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

function formatPlace(place: Place) {
	let country: string = place.countryCode
	try {
		country = regionNames.of(place.countryCode) ?? place.countryCode
	} catch {}

	const regionPart =
		place.region != null && place.region !== place.city ? place.region : null

	return [place.city, regionPart, country].filter(Boolean).join(', ')
}

export function CityAutocomplete({
	initialValue = '',
	onPlaceSelect,
	onPlaceClear,
	...inputProps
}: {
	initialValue?: string
	onPlaceSelect: (place: Place) => void
	onPlaceClear?: () => void
} & Omit<
	ComponentProps<typeof Input>,
	'value' | 'defaultValue' | 'onChange' | 'onFocus' | 'onBlur'
>) {
	const [query, setQuery] = useState(initialValue)
	const [results, setResults] = useState<GeoResult[]>([])
	const [open, setOpen] = useState(false)
	const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
	const controllerRef = useRef<AbortController | undefined>(undefined)

	const cancelPendingSearch = useCallback(() => {
		clearTimeout(timerRef.current)
		controllerRef.current?.abort()
	}, [])

	useEffect(() => cancelPendingSearch, [cancelPendingSearch])

	function search(text: string) {
		cancelPendingSearch()

		if (text.length < 2) {
			setResults([])
			setOpen(false)
			return
		}

		timerRef.current = setTimeout(async () => {
			const controller = new AbortController()
			controllerRef.current = controller

			try {
				const response = await fetch(
					`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
						text
					)}&count=6&language=en`,
					{ signal: controller.signal }
				)
				if (!response.ok) return

				const data = await response.json()
				setResults(
					((data.results ?? []) as GeoResult[]).filter(r => r.country_code)
				)
				setOpen(true)
			} catch (error) {
				if (error instanceof DOMException && error.name === 'AbortError') return
				console.error('City search failed:', error)
			}
		}, 300)
	}

	function handleChange(value: string) {
		setQuery(value)
		onPlaceClear?.()
		search(value.trim())
	}

	function handleSelect(result: GeoResult) {
		cancelPendingSearch()

		const place: Place = {
			city: result.name,
			region: result.admin1 ?? null,
			countryCode: result.country_code!,
		}

		setQuery(formatPlace(place))
		setResults([])
		setOpen(false)
		onPlaceSelect(place)
	}

	return (
		<div className='relative'>
			<Input
				{...inputProps}
				value={query}
				autoComplete='off'
				placeholder='Start typing a city...'
				onChange={e => handleChange(e.target.value)}
				onFocus={() => results.length > 0 && setOpen(true)}
				onBlur={() => setTimeout(() => setOpen(false), 150)}
			/>

			{open && results.length > 0 && (
				<ul className='absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md'>
					{results.map(result => (
						<li key={result.id}>
							<button
								type='button'
								className='w-full px-3 py-2 text-left text-sm hover:bg-accent'
								onMouseDown={e => e.preventDefault()}
								onClick={() => handleSelect(result)}
							>
								{formatPlace({
									city: result.name,
									region: result.admin1 ?? null,
									countryCode: result.country_code!,
								})}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
