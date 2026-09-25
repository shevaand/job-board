import { env } from '@/data/env/server'
import { GoogleGenAI } from '@google/genai'

export const genAI = new GoogleGenAI({
	apiKey: env.GEMINI_API_KEY,
})
