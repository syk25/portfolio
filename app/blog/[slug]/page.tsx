import { getBlogPost } from '@/lib/content'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post     = await getBlogPost(slug)
  if (!post) notFound()

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <Link
        href="/blog"
        className="text-[11px] text-ocean-muted hover:text-ink-secondary transition-colors mb-8 inline-block"
      >
        ← back to blog
      </Link>
      <p className="text-[10px] text-star-gold mb-3">◆ {post.date}</p>
      <h1 className="text-3xl font-medium text-ink-primary mb-4 leading-snug">{post.title}</h1>
      <p className="text-[14px] text-ocean-muted mb-10">{post.excerpt}</p>
      <hr className="border-ocean-dim/20 mb-10" />
      <article className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  )
}
