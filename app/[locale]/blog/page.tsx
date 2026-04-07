import { getTranslations } from 'next-intl/server'
import { getBlogPosts } from '@/lib/content'
import { BlogCard } from '@/components/ProjectCard'

export default async function BlogPage() {
  const t     = await getTranslations('blog')
  const posts = await getBlogPosts()

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <p className="text-[10px] tracking-widest text-star-gold uppercase mb-2">◆ {t('label')}</p>
      <h1 className="text-3xl font-medium text-ink-primary mb-2">{t('title')}</h1>
      <p className="text-[14px] text-ocean-muted mb-10">{t('description')}</p>
      <div className="flex flex-col">
        {posts.map(p => <BlogCard key={p.slug} post={p} />)}
      </div>
    </div>
  )
}
