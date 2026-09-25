import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware(async (auth, req) => {
	// 1. Отримуємо поточний шлях сторінки
	const { pathname } = req.nextUrl

	// 2. Визначаємо, чи є сторінка публічною
	const isPublicRoute =
		pathname === '/' ||
		pathname.startsWith('/sign-in') ||
		pathname.startsWith('/sign-up') ||
		pathname.startsWith('/api') ||
		pathname.startsWith('/job-listings') ||
		pathname.startsWith('/ai-search')

	// 3. Якщо сторінка НЕ публічна — вимагаємо авторизацію
	if (!isPublicRoute) {
		await auth.protect()
	}
})

// export default clerkMiddleware()

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
		// Always run for Clerk-specific frontend API routes
		'/__clerk/(.*)',
	],
}
