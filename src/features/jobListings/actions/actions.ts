'use server'

import { db } from '@/drizzle/db'
import { JobListingTable } from '@/drizzle/schema'
import { getMatchingJobListings } from '@/services/ai/getMatchingJobListings'
import {
	getCurrentOrganization,
	getCurrentUser,
} from '@/services/clerk/lib/getCurrentAuth'
import { hasOrgUserPermission } from '@/services/clerk/lib/getUserPermissions'
import { and, eq } from 'drizzle-orm'
import { cacheTag, revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import z from 'zod'
import {
	getJobListingGlobalTag,
	getJobListingIdTag,
} from '../db/cache/jobListings'
import {
	deleteJobListing as deleteJobListingDb,
	insertJobListing,
	updatedJobListing as updateJobListingDb,
} from '../db/jobListings'
import {
	hasReachedMaxFeaturedJobListings,
	hasReachedMaxPublishedJobListings,
} from '../lib/planfeatureHelpers'
import { getNextJobListingStatus } from '../lib/utils'
import { jobListingAiSearchSchema, jobListingSchema } from './schemas'

export async function createJobLsting(
	unsafeData: z.infer<typeof jobListingSchema>
) {
	const { orgId } = await getCurrentOrganization()

	if (
		orgId == null ||
		!(await hasOrgUserPermission('org:job_listings:create'))
	) {
		return {
			error: true,
			message: 'You dont have permission to create Job Listing',
		}
	}

	const { success, data } = jobListingSchema.safeParse(unsafeData)
	if (!success) {
		return {
			error: true,
			message: 'There was error creating your Job Listing',
		}
	}

	const wage = data.wage != null && !isNaN(data.wage) ? data.wage : null
	const wageInterval = wage != null ? data.wageInterval : null

	const jobListing = await insertJobListing({
		...data,
		wage,
		wageInterval,
		organizationId: orgId,
		status: 'draft',
	})

	redirect(`/employer/job-listings/${jobListing.id}`)
}

export async function updateJobListing(
	id: string,
	unsafeData: z.infer<typeof jobListingSchema>
) {
	const { orgId } = await getCurrentOrganization()

	if (
		orgId == null ||
		!(await hasOrgUserPermission('org:job_listings:update'))
	) {
		return {
			error: true,
			message: "You don't have permission to update this job listing",
		}
	}

	const { success, data } = jobListingSchema.safeParse(unsafeData)
	if (!success) {
		return {
			error: true,
			message: 'There was an error updating your job listing',
		}
	}

	const jobListing = await getJobListing(id, orgId)
	if (jobListing == null) {
		return {
			error: true,
			message: 'There was an error updating your job listing',
		}
	}

	const updatedJobListing = await updateJobListingDb(id, data)

	redirect(`/employer/job-listings/${updatedJobListing.id}`)
}

export async function toggleJobListingStatus(id: string) {
	console.log('test')
	const error = {
		error: true,
		message: "You don't have permission to update this job listing's status",
	}
	const { orgId } = await getCurrentOrganization()
	if (orgId == null) return error

	const jobListing = await getJobListing(id, orgId)
	if (jobListing == null) return error

	const newStatus = getNextJobListingStatus(jobListing.status)

	if (!(await hasOrgUserPermission('org:job_listings:change_status'))) {
		return {
			error: true,
			message: "You don't have permission to update this job listing's status",
		}
	}

	if (
		newStatus === 'published' &&
		(await hasReachedMaxPublishedJobListings())
	) {
		return {
			error: true,
			message:
				'You have reached the maximum number of published job listings for your plan.',
		}
	}

	await updateJobListingDb(id, {
		status: newStatus,
		isFeatured: newStatus === 'published' ? undefined : false,
		postedAt:
			newStatus === 'published' && jobListing.postedAt == null
				? new Date()
				: undefined,
	})
	revalidatePath('/employer/job-listings')
	revalidatePath(`/employer/job-listings/${id}`)

	return { error: false }
}

export async function toggleJobListingFeatured(id: string) {
	const error = {
		error: true,
		message:
			"You don't have permission to update this job listing's featured status",
	}
	const { orgId } = await getCurrentOrganization()
	if (orgId == null) return error

	const jobListing = await getJobListing(id, orgId)
	if (jobListing == null) return error

	const newFeaturedStatus = !jobListing.isFeatured
	if (
		!(await hasOrgUserPermission('org:job_listings:change_status')) ||
		(newFeaturedStatus && (await hasReachedMaxFeaturedJobListings()))
	) {
		return error
	}

	await updateJobListingDb(id, {
		isFeatured: newFeaturedStatus,
	})

	revalidatePath('/employer/job-listings')
	revalidatePath(`/employer/job-listings/${id}`)

	return { error: false }
}

export async function deleteJobListing(id: string) {
	const error = {
		error: true,
		message: "You don't have permission to delete this job listing",
	}
	const { orgId } = await getCurrentOrganization()
	if (orgId == null) return error

	const jobListing = await getJobListing(id, orgId)
	if (jobListing == null) return error

	if (!(await hasOrgUserPermission('org:job_listings:delete'))) {
		return error
	}

	await deleteJobListingDb(id)

	redirect('/employer')
}

export async function getAiJobListingSearchResults(
	unsafe: z.infer<typeof jobListingAiSearchSchema>
): Promise<
	{ error: true; message: string } | { error: false; jobIds: string[] }
> {
	const { success, data } = jobListingAiSearchSchema.safeParse(unsafe)
	if (!success) {
		return {
			error: true,
			message: 'There was an error processing your search query',
		}
	}

	const { userId } = await getCurrentUser()
	if (userId == null) {
		return {
			error: true,
			message: 'You need an account to use AI job search',
		}
	}

	const allListings = await getPublicJobListings()
	const matchedListings = await getMatchingJobListings(
		data.query,
		allListings,
		{
			maxNumberOfJobs: 10,
		}
	)

	if (matchedListings.length === 0) {
		return {
			error: true,
			message: 'No jobs match your search criteria',
		}
	}

	return { error: false, jobIds: matchedListings }
}

async function getJobListing(id: string, orgId: string) {
	'use cache'
	cacheTag(getJobListingIdTag(id))

	return db.query.JobListingTable.findFirst({
		where: and(
			eq(JobListingTable.id, id),
			eq(JobListingTable.organizationId, orgId)
		),
	})
}

async function getPublicJobListings() {
	'use cache'
	cacheTag(getJobListingGlobalTag())

	return db.query.JobListingTable.findMany({
		where: eq(JobListingTable.status, 'published'),
	})
}
