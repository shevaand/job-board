import { db } from '@/drizzle/db'
import { JobListingTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { revalidateJobLIstingCache } from './cache/jobListings'

export async function insertJobListing(
	jobListing: typeof JobListingTable.$inferInsert
) {
	const [newListing] = await db
		.insert(JobListingTable)
		.values({
			...jobListing,
			wage: jobListing.wage ? Number(jobListing.wage) || null : null,
			city: jobListing.city || null,
			stateAbbreviation: jobListing.stateAbbreviation || null,
		})
		.returning({
			id: JobListingTable.id,
			organizationId: JobListingTable.organizationId,
		})

	revalidateJobLIstingCache(newListing)

	return newListing
}

export async function updatedJobListing(
	id: string,
	jobListing: Partial<typeof JobListingTable.$inferInsert>
) {
	const [updatedListing] = await db
		.update(JobListingTable)
		.set(jobListing)
		.where(eq(JobListingTable.id, id))
		.returning({
			id: JobListingTable.id,
			organizationId: JobListingTable.organizationId,
		})

	revalidateJobLIstingCache(updatedListing)

	return updatedListing
}

export async function deleteJobListing(id: string) {
	const [deletedJobListing] = await db
		.delete(JobListingTable)
		.where(eq(JobListingTable.id, id))
		.returning({
			id: JobListingTable.id,
			organizationId: JobListingTable.organizationId,
		})

	revalidateJobLIstingCache(deletedJobListing)

	return deletedJobListing
}
