import { getGlobalTag, getIdTag } from '@/lib/dataCache'
import { revalidateTag } from 'next/cache'

export function getUserResumeGlobalTag() {
	return getGlobalTag('userResumes')
}

export function getUserResumeIdTag(userId: string) {
	return getIdTag('userResumes', userId)
}

export function revalidateUserResumeCache(userId: string) {
	revalidateTag(getUserResumeGlobalTag(), 'default')
	revalidateTag(getUserResumeIdTag(userId), 'default')
}
