import { env } from '@/data/env/server'
import {
	deleteOrganization,
	insertOrgaization,
	updateOrgaization,
} from '@/features/organization/db/organizations'
import {
	deleteOrganizationUserSettings,
	insertOrganizationUserSettings,
} from '@/features/organization/db/organizationUserSettings'
import { deleteUser, insertUser, updateUser } from '@/features/users/db/user'
import { insertUserNotificationSetting } from '@/features/users/db/userNotificationSettings'
import { NonRetriableError } from 'inngest'
import { Webhook } from 'svix'
import {
	clerkOrganizationCreated,
	clerkOrganizationDeleted,
	clerkOrganizationMembershipCreated,
	clerkOrganizationMembershipDeleted,
	clerkOrganizationUpdated,
	clerkUserCreated,
	clerkUserDeleted,
	clerkUserUpdated,
	inngest,
} from '../client'

function verifyWebhook({
	raw,
	headers,
}: {
	raw: string
	headers: Record<string, string>
}) {
	// if (
	// 	process.env.INNGEST_DEV === '1' ||
	// 	process.env.NODE_ENV === 'development'
	// ) {
	// 	console.log('⚠️ [Inngest] Lokal dev: skip verify Svix')
	// 	return true
	// }
	return new Webhook(env.CLERK_WEBHOOK_SECRET).verify(raw, headers)
}

export const ClerkCreateUser = inngest.createFunction(
	{
		id: 'clerk/create-db-user',
		name: 'Clerk - Create DB User',
		triggers: [clerkUserCreated],
	},
	async ({ event, step }) => {
		await step.run('verify-webhook', async () => {
			try {
				return verifyWebhook(event.data)
			} catch {
				throw new NonRetriableError('Invalid webhook')
			}
		})
		const userId = await step.run('create-user', async () => {
			const userData = event.data.data
			const email = userData.email_addresses.find(
				email => email.id === userData.primary_email_address_id
			)

			if (email == null) {
				throw new NonRetriableError('NO primary email address found')
			}

			await insertUser({
				id: userData.id,
				name: `${userData.first_name} ${userData.last_name}`,
				imageUrl: userData.image_url,
				email: email.email_address,
				createdAt: new Date(userData.created_at),
				updatedAt: new Date(userData.updated_at),
			})

			return userData.id
		})

		await step.run('create-user-notification-setting', async () => {
			await insertUserNotificationSetting({ userId })
		})
	}
)

export const ClerkUpdateUser = inngest.createFunction(
	{
		id: 'clerk/update-db-user',
		name: 'Clerk - Update DB User',
		triggers: [clerkUserUpdated],
	},
	async ({ event, step }) => {
		await step.run('verify-webhook', async () => {
			try {
				return verifyWebhook(event.data)
			} catch {
				throw new NonRetriableError('Invalid webhook')
			}
		})
		await step.run('update-user', async () => {
			const userData = event.data.data
			const email = userData.email_addresses.find(
				email => email.id === userData.primary_email_address_id
			)

			if (email == null) {
				throw new NonRetriableError('NO primary email address found')
			}

			await updateUser(userData.id, {
				name: `${userData.first_name} ${userData.last_name}`,
				imageUrl: userData.image_url,
				email: email.email_address,
				updatedAt: new Date(userData.updated_at),
			})
		})
	}
)

export const ClerkDeleteUser = inngest.createFunction(
	{
		id: 'clerk/delete-db-user',
		name: 'Clerk - Delete DB User',
		triggers: [clerkUserDeleted],
	},
	async ({ event, step }) => {
		await step.run('verify-webhook', async () => {
			try {
				return verifyWebhook(event.data)
			} catch {
				throw new NonRetriableError('Invalid webhook')
			}
		})

		await step.run('delete-user', async () => {
			const { id } = event.data.data

			if (id == null) {
				throw new NonRetriableError('No id found')
			}
			await deleteUser(id)
		})
	}
)

export const ClerkCreateOrganization = inngest.createFunction(
	{
		id: 'clerk/create-db-organization',
		name: 'Clerk - Create DB Organization',
		triggers: [clerkOrganizationCreated],
	},
	async ({ event, step }) => {
		await step.run('verify-webhook', async () => {
			try {
				return verifyWebhook(event.data)
			} catch {
				throw new NonRetriableError('Invalid webhook')
			}
		})
		await step.run('create-organization', async () => {
			const orgData = event.data.data

			await insertOrgaization({
				id: orgData.id,
				name: orgData.name,
				imageUrl: orgData.image_url,
				createdAt: new Date(orgData.created_at),
				updatedAt: new Date(orgData.updated_at),
			})

			return orgData.id
		})
	}
)

export const ClerkUpdateOrganization = inngest.createFunction(
	{
		id: 'clerk/update-db-organization',
		name: 'Clerk - Update DB Organization',
		triggers: [clerkOrganizationUpdated],
	},
	async ({ event, step }) => {
		await step.run('verify-webhook', async () => {
			try {
				return verifyWebhook(event.data)
			} catch {
				throw new NonRetriableError('Invalid webhook')
			}
		})
		await step.run('create-organization', async () => {
			const orgData = event.data.data

			await updateOrgaization(orgData.id, {
				name: orgData.name,
				imageUrl: orgData.image_url,
				updatedAt: new Date(orgData.updated_at),
			})

			return orgData.id
		})
	}
)

export const ClerkDeleteOrganization = inngest.createFunction(
	{
		id: 'clerk/delete-db-organization',
		name: 'Clerk - Delete DB Organization',
		triggers: [clerkOrganizationDeleted],
	},
	async ({ event, step }) => {
		await step.run('verify-webhook', async () => {
			try {
				return verifyWebhook(event.data)
			} catch {
				throw new NonRetriableError('Invalid webhook')
			}
		})
		await step.run('delete-organization', async () => {
			const { id } = event.data.data

			if (id == null) {
				throw new NonRetriableError('No id found')
			}
			await deleteOrganization(id)
		})
	}
)

export const clerkCreateOrgMembership = inngest.createFunction(
	{
		id: 'clerk/create-organization-user-settings',
		name: 'Clerk - Create Organization User Settings',
		triggers: [clerkOrganizationMembershipCreated],
	},

	async ({ event, step }) => {
		await step.run('verify-webhook', async () => {
			try {
				verifyWebhook(event.data)
			} catch {
				throw new NonRetriableError('Invalid webhook')
			}
		})

		await step.run('create-organization-user-settings', async () => {
			const userId = event.data.data.public_user_data.user_id
			const orgId = event.data.data.organization.id

			await insertOrganizationUserSettings({
				userId,
				organizationId: orgId,
			})
		})
	}
)

export const clerkDeleteOrgMembership = inngest.createFunction(
	{
		id: 'clerk/delete-organization-user-settings',
		name: 'Clerk - Delete Organization User Settings',
		triggers: [clerkOrganizationMembershipDeleted],
	},
	async ({ event, step }) => {
		await step.run('verify-webhook', async () => {
			try {
				verifyWebhook(event.data)
			} catch {
				throw new NonRetriableError('Invalid webhook')
			}
		})

		await step.run('delete-organization-user-settings', async () => {
			const userId = event.data.data.public_user_data.user_id
			const orgId = event.data.data.organization.id

			await deleteOrganizationUserSettings({
				userId,
				organizationId: orgId,
			})
		})
	}
)
