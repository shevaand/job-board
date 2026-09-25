import { getGlobalTag, getIdTag, getOrganizationTag } from '@/lib/dataCache'
import { updateTag } from 'next/cache'

export function getJobListingGlobalTag() {
	return getGlobalTag('jobListings')
}

export function getJobListingOrganizationTag(organizationId: string) {
	return getOrganizationTag('jobListings', organizationId)
}

export function getJobListingIdTag(id: string) {
	return getIdTag('jobListings', id)
}

export function revalidateJobLIstingCache({
	id,
	organizationId,
}: {
	id: string
	organizationId: string
}) {
	updateTag(getJobListingGlobalTag())
	updateTag(getJobListingOrganizationTag(organizationId))
	updateTag(getJobListingIdTag(id))
}
