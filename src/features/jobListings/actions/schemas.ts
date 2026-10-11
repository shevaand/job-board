import {
	experienceLevels,
	jobListingTypes,
	locationRequirements,
	wageIntervals,
} from '@/drizzle/schema'
import { z } from 'zod'

export const jobListingSchema = z
	.object({
		title: z.string().min(1, 'Required'),
		description: z.string().min(1, 'Required'),
		experienceLevel: z.enum(experienceLevels),
		locationRequirement: z.enum(locationRequirements),
		type: z.enum(jobListingTypes),
		wage: z.number().int().positive().min(1).nullable(),
		wageInterval: z.enum(wageIntervals).nullable(),
		city: z
			.string()
			.transform(val => (val.trim() === '' ? null : val))
			.nullable(),
		region: z
			.string()
			.transform(val => (val.trim() === '' ? null : val))
			.nullable(),
		countryCode: z
			.string()
			.transform(val => (val.trim() === '' ? null : val.trim().toUpperCase()))
			.nullable(),
	})
	.refine(
		listing => {
			return listing.locationRequirement === 'remote' || listing.city != null
		},
		{
			message: 'Required for non-remote listings',
			path: ['city'],
		}
	)
	.refine(
		listing => {
			return (
				listing.locationRequirement === 'remote' || listing.countryCode != null
			)
		},
		{
			message: 'Select a city from the suggestions',
			path: ['city'],
		}
	)
	.refine(
		listing => {
			return (
				listing.countryCode == null || /^[A-Z]{2}$/.test(listing.countryCode)
			)
		},
		{
			message: 'Invalid country',
			path: ['city'],
		}
	)

export const newJobListingApplicationSchema = z.object({
	coverLetter: z
		.string()
		.transform(val => (val.trim() === '' ? null : val))
		.nullable(),
})

export const jobListingAiSearchSchema = z.object({
	query: z.string().min(1, 'Required'),
})
