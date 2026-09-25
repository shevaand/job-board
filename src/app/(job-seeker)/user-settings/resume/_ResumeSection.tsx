'use client'

import { Button } from '@/components/ui/button'
import { CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { useState } from 'react'
import { DropzoneClient } from './_DropzoneLoader'

export function ResumeSection({ initialUrl }: { initialUrl: string | null }) {
	const [resumeUrl, setResumeUrl] = useState(initialUrl)

	return (
		<>
			<DropzoneClient onUploaded={setResumeUrl} />
			{resumeUrl != null && (
				<CardFooter>
					<Button asChild>
						<Link href={resumeUrl} target='_blank' rel='noopener noreferrer'>
							View Resume
						</Link>
					</Button>
				</CardFooter>
			)}
		</>
	)
}
