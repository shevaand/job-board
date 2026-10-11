import { Badge } from '@/components/ui/badge'
import { JobListingTable } from '@/drizzle/schema'
import { cn } from '@/lib/utils'
import {
	BanknoteIcon,
	BuildingIcon,
	GraduationCapIcon,
	HourglassIcon,
	MapPinIcon,
} from 'lucide-react'
import { ComponentProps } from 'react'
import {
	formatExperienceLevel,
	formatJobListingLocation,
	formatJobType,
	formatLocationRequirement,
	formatWage,
} from '../lib/formatters'

export function JobListingBadges({
	jobListing: {
		wage,
		wageInterval,
		city,
		region,
		countryCode,
		type,
		experienceLevel,
		locationRequirement,
		isFeatured,
	},
	className,
}: {
	jobListing: Pick<
		typeof JobListingTable.$inferSelect,
		| 'wage'
		| 'wageInterval'
		| 'city'
		| 'region'
		| 'countryCode'
		| 'type'
		| 'experienceLevel'
		| 'locationRequirement'
		| 'isFeatured'
	>
	className?: string
}) {
	const badgeProps = {
		variant: 'outline',
		className,
	} satisfies ComponentProps<typeof Badge>

	return (
		<>
			{isFeatured && (
				<Badge
					{...badgeProps}
					className={cn(
						className,
						'border-featured bg-featured/50 text-featured-foreground'
					)}
				>
					Featured
				</Badge>
			)}
			{wage != null && wageInterval != null && (
				<Badge {...badgeProps}>
					<BanknoteIcon />
					{formatWage(wage, wageInterval)}
				</Badge>
			)}
			{(city != null || countryCode != null) && (
				<Badge {...badgeProps}>
					<MapPinIcon />
					{formatJobListingLocation({ city, region, countryCode })}
				</Badge>
			)}
			<Badge {...badgeProps}>
				<BuildingIcon />
				{formatLocationRequirement(locationRequirement)}
			</Badge>
			<Badge {...badgeProps}>
				<HourglassIcon />
				{formatJobType(type)}
			</Badge>
			<Badge {...badgeProps}>
				<GraduationCapIcon />
				{formatExperienceLevel(experienceLevel)}
			</Badge>
		</>
	)
}
