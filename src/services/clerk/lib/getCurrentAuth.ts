import { auth } from '@clerk/nextjs/server'
import { getCachedOrganization, getCachedUser } from './cachedQueries'

export async function getCurrentUser({ allData = false } = {}) {
	const { userId } = await auth()

	return {
		userId,
		user: allData && userId != null ? await getCachedUser(userId) : undefined,
	}
}

export async function getCurrentOrganization({ allData = false } = {}) {
	const { orgId } = await auth()

	return {
		orgId,
		organization:
			allData && orgId != null ? await getCachedOrganization(orgId) : undefined,
	}
}
