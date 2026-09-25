import { db } from '@/drizzle/db'
import { UserNotificationSettingsTable } from '@/drizzle/schema'
import { revalidateUserNotificationSettingsCache } from './cache/userNotificationSetting'

export async function insertUserNotificationSetting(
	settings: typeof UserNotificationSettingsTable.$inferInsert
) {
	await db
		.insert(UserNotificationSettingsTable)
		.values(settings)
		.onConflictDoNothing()

	revalidateUserNotificationSettingsCache(settings.userId)
}

export async function updateUserNotificationSettings(
	userId: string,
	settings: Partial<
		Omit<typeof UserNotificationSettingsTable.$inferInsert, 'userId'>
	>
) {
	await db
		.insert(UserNotificationSettingsTable)
		.values({ ...settings, userId })
		.onConflictDoUpdate({
			target: UserNotificationSettingsTable.userId,
			set: settings,
		})

	revalidateUserNotificationSettingsCache(userId)
}
