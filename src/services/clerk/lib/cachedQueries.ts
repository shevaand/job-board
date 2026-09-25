'use cache'

import { db } from '@/drizzle/db'
import { OrganizationTable, UserTable } from '@/drizzle/schema'
import { getOrganizationIdTag } from '@/features/organization/db/cache/organization'
import { getUserIdTag } from '@/features/users/db/cache/users'
import { eq } from 'drizzle-orm'
import { cacheTag } from 'next/cache'

export async function getCachedUser(id: string) {
	cacheTag(getUserIdTag(id))

	return db.query.UserTable.findFirst({
		where: eq(UserTable.id, id),
	})
}

export async function getCachedOrganization(id: string) {
	cacheTag(getOrganizationIdTag(id))

	return db.query.OrganizationTable.findFirst({
		where: eq(OrganizationTable.id, id),
	})
}
