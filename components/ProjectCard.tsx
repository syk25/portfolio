import Link from 'next/link'
import type { Project, BlogPost } from '@/lib/content'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card-shimmer block bg-space-surface rounded-xl group select-none
        transition-all duration-300 ease-out
        shadow-[0_2px_12px_rgba(0,0,0,0.55),inset_0_0_0_1px_rgba(255,255,255,0.03),inset_0_1px_0_rgba(255,255,255,0.04)]
        hover:shadow-[0_0_0_1px_rgba(240,192,96,0.28),0_16px_48px_rgba(240,192,96,0.10),inset_0_1px_0_rgba(240,192,96,0.07)]
        hover:-translate-y-1.5
        active:scale-[0.975] active:translate-y-0.5 active:duration-75
        active:shadow-[0_0_0_1px_rgba(240,192,96,0.48),0_4px_20px_rgba(240,192,96,0.16),inset_0_1px_0_rgba(240,192,96,0.10)]"
    >
      {/* Header thumbnail */}
      <div className="h-28 rounded-t-xl bg-gradient-to-br from-ocean-dark/55 to-ocean-dark/20 flex items-end justify-between p-3 transition-all duration-300 group-hover:from-ocean-dark/70 group-hover:to-ocean-dark/30">
        <span className="text-xs font-mono text-ocean-light/45 tracking-wider transition-colors duration-300 group-hover:text-ocean-light/80">
          {project.slug}
        </span>
        <span className="text-ocean-light/20 text-xs transition-all duration-300 group-hover:text-star-gold/70 group-hover:translate-x-0.5">
          →
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-ink-secondary mb-1.5 transition-colors duration-200 group-hover:text-ink-primary">
          {project.title}
        </h3>
        <p className="text-[13px] text-ink-faint leading-relaxed mb-3">
          {project.description}
        </p>
        <p className="text-xs text-star-gold">✦ {project.date}</p>
      </div>
    </Link>
  )
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="relative block py-4 pl-0 border-b border-ocean-dim/20 last:border-b-0 group overflow-hidden transition-all duration-250 ease-out hover:pl-3"
    >
      {/* Left gold accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-star-gold origin-center scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out"
        aria-hidden="true"
      />
      <p className="text-xs text-star-gold mb-1.5">✦ {post.date}</p>
      <h3 className="text-sm font-medium text-ink-secondary group-hover:text-ink-primary transition-colors duration-200 mb-1.5">
        {post.title}
      </h3>
      <p className="text-[13px] text-ink-faint leading-relaxed transition-colors duration-200 group-hover:text-ink-muted">
        {post.excerpt}
      </p>
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
      className="card-shimmer flex items-center gap-3 px-4 py-3.5 rounded-xl bg-space-card group select-none
        transition-all duration-250 ease-out
        shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.03),inset_0_1px_0_rgba(255,255,255,0.04)]
        hover:shadow-[0_0_0_1px_rgba(240,192,96,0.24),0_8px_28px_rgba(240,192,96,0.09),inset_0_1px_0_rgba(240,192,96,0.06)]
        hover:-translate-y-0.5
        active:scale-[0.98] active:translate-y-0.5 active:duration-75
        active:shadow-[0_0_0_1px_rgba(240,192,96,0.44),0_4px_16px_rgba(240,192,96,0.13),inset_0_1px_0_rgba(240,192,96,0.08)]"
    >
      <div className="w-8 h-8 rounded-lg bg-star-gold flex items-center justify-center text-xs font-medium text-[#100c00] flex-shrink-0 transition-all duration-250 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(240,192,96,0.45)] group-active:scale-100">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-ink-secondary group-hover:text-ink-primary transition-colors duration-200">
          {label}
        </p>
        <p className="text-[13px] text-ink-faint">{sub}</p>
      </div>
      <span className="ml-auto text-star-gold/50 text-sm transition-all duration-200 group-hover:text-star-gold group-hover:translate-x-0.5 group-active:translate-x-0">
        →
      </span>
    </a>
  )
}
