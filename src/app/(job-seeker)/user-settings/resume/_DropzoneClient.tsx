'use client'

import { UploadDropzone } from '@/services/uploadthing/components/UploadThing'
import { useRouter } from 'next/navigation'

export function DropzoneClient({
	onUploaded,
}: {
	onUploaded?: (url: string) => void
}) {
	const router = useRouter()

	return (
		<UploadDropzone
			endpoint='resumeUploader'
			onClientUploadComplete={res => {
				const url = res[0]?.serverData?.resumeFileUrl
				if (url) onUploaded?.(url)

				// AI summary готується у фоні (Inngest), тож пробуємо
				// оновити сторінку кілька разів, поки воно не з'явиться
				let attempts = 0
				const interval = setInterval(() => {
					attempts++
					router.refresh()
					if (attempts >= 10) clearInterval(interval)
				}, 3000)
			}}
		/>
	)
}
