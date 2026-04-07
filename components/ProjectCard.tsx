import Link from 'next/link'
import type { Project, BlogPost } from '@/lib/content'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-space-surface border border-ocean-light/12 rounded-xl overflow-hidden group">
      <div className="h-28 bg-ocean-dark/40 border-b border-ocean-light/10 flex items-end p-3">
        <span className="text-xs font-mono text-ocean-light/60 tracking-wider">
          {project.slug}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-ink-secondary mb-1.5">{project.title}</h3>
        <p className="text-[13px] text-ink-faint leading-relaxed mb-3">{project.description}</p>
        <p className="text-xs text-star-gold mb-3">✦ {project.date}</p>
        <Link
          href={`/projects/${project.slug}`}
          className="block text-center text-xs font-medium py-2 rounded-lg bg-star-gold text-[#100c00] hover:bg-star-pale transition-colors"
        >
          view
        </Link>
      </div>
    </div>
  )
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block py-4 border-b border-ocean-dim/20 last:border-b-0 group"
    >
      <p className="text-xs text-star-gold mb-1.5">✦ {post.date}</p>
      <h3 className="text-sm font-medium text-ink-secondary group-hover:text-ink-primary transition-colors mb-1.5">
        {post.title}
      </h3>
      <p className="text-[13px] text-ink-faint leading-relaxed">{post.excerpt}</p>
    </Link>
  )
}

export function LinkCard({
  icon, label, sub, href,
}: {
  icon: string; label: string; sub: string; href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-ocean-light/12 bg-space-card hover:border-ocean-light/25 transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-star-gold flex items-center justify-center text-xs font-medium text-[#100c00] flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-ink-secondary group-hover:text-ink-primary transition-colors">
          {label}
        </p>
        <p className="text-[13px] text-ink-faint">{sub}</p>
      </div>
      <span className="ml-auto text-star-gold text-sm">→</span>
    </a>
  )
}
