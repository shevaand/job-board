import { db } from '@/drizzle/db'
import { OrganizationTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { revalidateOrganizationCache } from './cache/organization'

export async function insertOrgaization(
	organization: typeof OrganizationTable.$inferInsert
) {
	await db.insert(OrganizationTable).values(organization).onConflictDoNothing()

	revalidateOrganizationCache(organization.id)
}

export async function updateOrgaization(
	id: string,
	organization: Partial<typeof OrganizationTable.$inferInsert>
) {
	await db
		.update(OrganizationTable)
		.set(organization)
		.where(eq(OrganizationTable.id, id))

	revalidateOrganizationCache(id)
}

export async function deleteOrganization(id: string) {
	await db.delete(OrganizationTable).where(eq(OrganizationTable.id, id))

	revalidateOrganizationCache(id)
}
