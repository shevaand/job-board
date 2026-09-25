import { getGlobalTag, getIdTag, getJobListingTag } from '@/lib/dataCache'
import { updateTag } from 'next/cache'

export function getJobListingApplicationGlobalTag() {
	return getGlobalTag('jobListingApplications')
}

export function getJobListingApplicationJobListingTag(jobListingId: string) {
	return getJobListingTag('jobListingApplications', jobListingId)
}

export function getJobListingApplicationIdTag({
	jobListingId,
	userId,
}: {
	jobListingId: string
	userId: string
}) {
	return getIdTag('jobListingApplications', `${jobListingId}-${userId}`)
}

export function revalidateJobListingApplicationCache(id: {
	userId: string
	jobListingId: string
}) {
	updateTag(getJobListingApplicationGlobalTag())
	updateTag(getJobListingApplicationJobListingTag(id.jobListingId))
	updateTag(getJobListingApplicationIdTag(id))
}
