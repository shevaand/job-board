import { db } from '@/drizzle/db'
import { UserResumeTable } from '@/drizzle/schema'
import { updateUserResume } from '@/features/users/db/userResumes'
import { generateAiSummaryFromResume } from '@/services/ai/resume'
import { eq } from 'drizzle-orm'
import { inngest, resumeUploaded } from '../client'

export const createAiSummaryOfUploadedResume = inngest.createFunction(
	{
		id: 'create-ai-summary-of-uploaded-resume',
		name: 'Create AI Summary of Uploaded Resume',
		triggers: [resumeUploaded],
	},
	async ({ step, event }) => {
		const { id: userId } = event.data.user

		const userResume = await step.run('get-user-resume', async () => {
			return db.query.UserResumeTable.findFirst({
				where: eq(UserResumeTable.userId, userId),
				columns: { resumeFileUrl: true },
			})
		})
		if (userResume == null) return

		const aiSummary = await step.run('create-ai-summary', async () => {
			return generateAiSummaryFromResume(userResume.resumeFileUrl)
		})

		await step.run('save-ai-summary', async () => {
			await updateUserResume(userId, { aiSummary })
		})
	}
)
