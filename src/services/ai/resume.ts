import { genAI } from './client'

export async function generateAiSummaryFromResume(resumeFileUrl: string) {
	const fileResponse = await fetch(resumeFileUrl)
	const arrayBuffer = await fileResponse.arrayBuffer()
	const base64Pdf = Buffer.from(arrayBuffer).toString('base64')

	const response = await genAI.models.generateContent({
		model: 'gemini-3.6-flash',
		contents: [
			{
				role: 'user',
				parts: [
					{
						inlineData: {
							mimeType: 'application/pdf',
							data: base64Pdf,
						},
					},
					{
						text: "Summarize the following resume and extract all key skills, experience, and qualifications. The summary should include all the information a hiring manager would need to determine if the candidate is a good fit for a job. Format the summary as markdown. Do not return any other text. If the file does not look like a resume, return the text 'N/A'.",
					},
				],
			},
		],
		config: {
			maxOutputTokens: 2048,
		},
	})

	console.log('finishReason:', response.candidates?.[0]?.finishReason)

	return response.text ?? ''
}
