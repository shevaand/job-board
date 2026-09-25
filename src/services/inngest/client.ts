import { JobListingTable } from '@/drizzle/schema'
import {
	DeletedObjectJSON,
	OrganizationJSON,
	OrganizationMembershipJSON,
	UserJSON,
} from '@clerk/nextjs/server'
import { eventType, Inngest, staticSchema } from 'inngest'

type ClerkWebHookData<T> = {
	data: T
	raw: string
	headers: Record<string, string>
}

export const clerkUserCreated = eventType('clerk/user.created', {
	schema: staticSchema<ClerkWebHookData<UserJSON>>(),
})

export const clerkUserUpdated = eventType('clerk/user.updated', {
	schema: staticSchema<ClerkWebHookData<UserJSON>>(),
})

export const clerkUserDeleted = eventType('clerk/user.deleted', {
	schema: staticSchema<ClerkWebHookData<DeletedObjectJSON>>(),
})

export const clerkOrganizationCreated = eventType(
	'clerk/organization.created',
	{
		schema: staticSchema<ClerkWebHookData<OrganizationJSON>>(),
	}
)

export const clerkOrganizationUpdated = eventType(
	'clerk/organization.updated',
	{
		schema: staticSchema<ClerkWebHookData<OrganizationJSON>>(),
	}
)

export const clerkOrganizationDeleted = eventType(
	'clerk/organization.deleted',
	{
		schema: staticSchema<ClerkWebHookData<DeletedObjectJSON>>(),
	}
)

export const jobListingApplicationCreate = eventType(
	'app/jobListingApplication.create',
	{
		schema: staticSchema<{
			jobListingId: string
			userId: string
		}>(),
	}
)

export const resumeUploaded = eventType('app/resume.uploaded', {
	schema: staticSchema<{
		user: {
			id: string
		}
	}>(),
})

export const emailDailyUserJobListings = eventType(
	'app/email.daily-user-job-listings',
	{
		schema: staticSchema<{
			aiPrompt?: string
			jobListings: (Omit<
				typeof JobListingTable.$inferSelect,
				'createdAt' | 'postedAt' | 'updatedAt' | 'status' | 'organizationId'
			> & { organizationName: string })[]
			user: {
				email: string
				name: string
			}
		}>(),
	}
)

export const emailDailyOrganizationUserApplications = eventType(
	'app/email.daily-organization-user-applications',
	{
		schema: staticSchema<{
			applications: {
				organizationId: string
				organizationName: string
				jobListingId: string
				jobListingTitle: string
				userName: string
				rating: number | null
			}[]
			user: {
				email: string
				name: string
			}
		}>(),
	}
)

export const clerkOrganizationMembershipCreated = eventType(
	'clerk/organizationMembership.created',
	{
		schema: staticSchema<ClerkWebHookData<OrganizationMembershipJSON>>(),
	}
)

export const clerkOrganizationMembershipDeleted = eventType(
	'clerk/organizationMembership.deleted',
	{
		schema: staticSchema<ClerkWebHookData<OrganizationMembershipJSON>>(),
	}
)

export const inngest = new Inngest({
	id: 'job-board',
})
