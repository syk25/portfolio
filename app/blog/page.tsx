import { getBlogPosts } from '@/lib/content'
import { BlogCard } from '@/components/ProjectCard'

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <p className="text-[10px] tracking-widest text-star-gold uppercase mb-2">✦ Writing</p>
      <h1 className="text-3xl font-medium text-ink-primary mb-2">Blog</h1>
      <p className="text-[14px] text-ocean-muted mb-10">
        Thoughts on technology, people, and building with purpose.
      </p>
      <div className="flex flex-col">
        {posts.map(p => <BlogCard key={p.slug} post={p} />)}
      </div>
    </div>
  )
}
