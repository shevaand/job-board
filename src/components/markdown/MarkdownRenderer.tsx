import { cn } from '@/lib/utils'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

export const markdownClassNames =
	'max-w-none prose prose-neutral dark:prose-invert font-sans'

export function MarkdownRenderer({
	className,
	options,
	source,
	...props
}: MDXRemoteProps & { className?: string }) {
	const sanitizedSource =
		typeof source === 'string'
			? source.replace(/{/g, '&#123;').replace(/}/g, '&#125;')
			: source
	return (
		<div className={cn(markdownClassNames, className)}>
			<MDXRemote
				{...props}
				source={sanitizedSource}
				options={{
					mdxOptions: {
						remarkPlugins: [
							remarkGfm,
							...(options?.mdxOptions?.recmaPlugins ?? []),
						],
						...options?.mdxOptions,
					},
				}}
			/>
		</div>
	)
}
