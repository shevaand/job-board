import {
	ExperienceLevel,
	JobListingStatus,
	jobListingType,
	LocationRequirement,
	WageInterval,
} from '@/drizzle/schema'

export function formatWageInterval(interval: WageInterval) {
	switch (interval) {
		case 'hourly':
			return 'Hour'
		case 'yearly':
			return 'Year'
		default:
			throw new Error(`Invalid wage interval: ${interval satisfies never}`)
	}
}

export function formatLocationRequirement(
	locationRequirement: LocationRequirement
) {
	switch (locationRequirement) {
		case 'remote':
			return 'Remote'
		case 'in-office':
			return 'In Office'
		case 'hybrid':
			return 'Hybrid'
		default:
			throw new Error(
				`Unknown location requirement: ${locationRequirement satisfies never}`
			)
	}
}

export function formatJobType(type: jobListingType) {
	switch (type) {
		case 'full-time':
			return 'Full Time'
		case 'part-time':
			return 'Part Time'
		case 'internship':
			return 'Internship'
		default:
			throw new Error(`Unknown job type: ${type satisfies never}`)
	}
}

export function formatExperienceLevel(experienceLevel: ExperienceLevel) {
	switch (experienceLevel) {
		case 'junior':
			return 'Junior'
		case 'mid-level':
			return 'Mid Level'
		case 'senior':
			return 'Senior'
		default:
			throw new Error(
				`Unknown experience level: ${experienceLevel satisfies never}`
			)
	}
}

export function formatJobListingStatus(status: JobListingStatus) {
	switch (status) {
		case 'published':
			return 'Active'
		case 'draft':
			return 'Draft'
		case 'delisted':
			return 'Delisted'
		default:
			throw new Error(`Unknown status: ${status satisfies never}`)
	}
}

export function formatWage(wage: number, wageInterval: WageInterval) {
	const wageFormatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
	})

	switch (wageInterval) {
		case 'hourly': {
			return `${wageFormatter.format(wage)} / hr`
		}
		case 'yearly': {
			return wageFormatter.format(wage)
		}
		default:
			throw new Error(`Unknown wage interval: ${wageInterval satisfies never}`)
	}
}

const countryNames = new Intl.DisplayNames(['en'], { type: 'region' })

export function formatCountry(countryCode?: string | null) {
	if (countryCode == null) return null

	try {
		return countryNames.of(countryCode.toUpperCase()) ?? countryCode
	} catch {
		return countryCode
	}
}

export function formatJobListingLocation({
	city,
	region,
	countryCode,
}: {
	city?: string | null
	region?: string | null
	countryCode?: string | null
}) {
	const country = formatCountry(countryCode)

	const regionPart = region != null && region !== city ? region : null

	const locationParts = [city, regionPart, country].filter(
		(part): part is string => part != null
	)

	return locationParts.length === 0 ? 'None' : locationParts.join(', ')
}
