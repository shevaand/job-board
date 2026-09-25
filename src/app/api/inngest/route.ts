import { inngest } from '@/services/inngest/client'
import {
	ClerkCreateOrganization,
	clerkCreateOrgMembership,
	ClerkCreateUser,
	ClerkDeleteOrganization,
	clerkDeleteOrgMembership,
	ClerkDeleteUser,
	ClerkUpdateOrganization,
	ClerkUpdateUser,
} from '@/services/inngest/functions/clerk'
import {
	prepareDailyOrganizationUserApplicationNotifications,
	prepareDailyUserJobListingNotifications,
	sendDailyOrganizationUserApplicationEmail,
	sendDailyUserJobListingEmail,
} from '@/services/inngest/functions/email'
import { rankApplication } from '@/services/inngest/functions/jobListingApplication'
import { createAiSummaryOfUploadedResume } from '@/services/inngest/functions/resume'
import { serve } from 'inngest/next'

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [
		ClerkCreateUser,
		ClerkUpdateUser,
		ClerkDeleteUser,
		ClerkCreateOrganization,
		ClerkUpdateOrganization,
		ClerkDeleteOrganization,
		clerkCreateOrgMembership,
		clerkDeleteOrgMembership,
		createAiSummaryOfUploadedResume,
		rankApplication,
		prepareDailyUserJobListingNotifications,
		sendDailyUserJobListingEmail,
		prepareDailyOrganizationUserApplicationNotifications,
		sendDailyOrganizationUserApplicationEmail,
	],
})
