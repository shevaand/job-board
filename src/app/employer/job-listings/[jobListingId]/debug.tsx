import { auth } from '@clerk/nextjs/server'

export async function ClerkDebugBanner() {
	const { userId, orgId, orgRole, orgPermissions, has } = await auth()

	if (!userId)
		return (
			<div className='p-4 bg-gray-100 rounded'>Користувач не авторизований</div>
		)

	// Перевірка конкретних ключів, які ви використовуєте
	const canUpdate = has({ permission: 'org:job_listings_update' })
	const canChangeStatus = has({ permission: 'org:job_listing_change_status' })

	return (
		<div className='p-4 my-4 border border-amber-300 bg-amber-50 rounded-lg text-xs font-mono space-y-2'>
			<p className='font-bold text-amber-900'>🛠️ Clerk Auth Debug Panel</p>

			<div>
				<span className='font-semibold'>User ID:</span> {userId}
			</div>
			<div>
				<span className='font-semibold'>Active Org ID:</span>{' '}
				{orgId ?? '❌ Не вибрана (Active Org is null!)'}
			</div>
			<div>
				<span className='font-semibold'>Current Org Role:</span>{' '}
				<span className='px-1.5 py-0.5 bg-amber-200 rounded'>
					{orgRole ?? 'Немає'}
				</span>
			</div>

			<div>
				<span className='font-semibold'>Has `org:job_listings_update`:</span>{' '}
				<span
					className={
						canUpdate ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
					}
				>
					{String(canUpdate)}
				</span>
			</div>

			<div>
				<span className='font-semibold'>
					Has `org:job_listing_change_status`:
				</span>{' '}
				<span
					className={
						canChangeStatus
							? 'text-green-600 font-bold'
							: 'text-red-600 font-bold'
					}
				>
					{String(canChangeStatus)}
				</span>
			</div>
			<div>
				<span className='font-semibold'>Without org prefix:</span>{' '}
				{String(has({ permission: 'job_listings_update' }))}
			</div>

			<div>
				<span className='font-semibold'>
					All Active Org Permissions ({orgPermissions?.length ?? 0}):
				</span>
				<pre className='mt-1 p-2 bg-amber-100/70 rounded max-h-40 overflow-auto text-[11px]'>
					{JSON.stringify(orgPermissions, null, 2)}
				</pre>
			</div>
		</div>
	)
}
