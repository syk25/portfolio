import Link from 'next/link'
import { getProjects, getBlogPosts, getLandingSettings } from '@/lib/content'
import type { SectionKey } from '@/lib/content'
import { ProjectCard } from '@/components/ProjectCard'
import { BlogCard } from '@/components/ProjectCard'
import { LinkCard } from '@/components/ProjectCard'

export default async function Home() {
  const projects                                                             = (await getProjects()).slice(0, 2)
  const posts                                                               = (await getBlogPosts()).slice(0, 3)
  const { subheader, heroSubtitle, description, sectionOrder, socialLinks, storyItems, chipLinks } = await getLandingSettings()

  const visibleLinks = socialLinks.filter(l => !l.hidden)

  const sections: Record<SectionKey, React.ReactNode> = {
    projects: (
      <section className="py-10">
        <div className="flex justify-between items-center mb-5">
          <p className="text-xs tracking-widest text-ocean-faint uppercase">Projects</p>
          <Link href="/projects" className="text-xs text-star-gold hover:text-star-pale transition-colors">
            view all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map(p => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>
    ),
    story: (
      <section className="py-10">
        <p className="text-xs tracking-widest text-ocean-faint uppercase mb-5">My story</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {storyItems.map((s, i) => (
            <div
              key={i}
              className="bg-space-card rounded-xl p-4 transition-all duration-300 ease-out
                shadow-[0_2px_8px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(255,255,255,0.03),inset_0_1px_0_rgba(255,255,255,0.04)]
                hover:shadow-[0_0_0_1px_rgba(240,192,96,0.20),0_8px_24px_rgba(240,192,96,0.07),inset_0_1px_0_rgba(240,192,96,0.05)]
                hover:-translate-y-0.5 group"
            >
              <h3 className="text-sm font-medium text-ink-secondary mb-1.5 group-hover:text-ink-primary transition-colors duration-200">{s.title}</h3>
              <p className="text-[13px] text-ink-faint leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    social: (
      <section className="py-10">
        <p className="text-xs tracking-widest text-ocean-faint uppercase mb-5">Find me</p>
        <div className="flex flex-col gap-2">
          {visibleLinks.map(l => <LinkCard key={l.label} {...l} />)}
        </div>
      </section>
    ),
    blog: posts.length > 0 ? (
      <section className="py-10">
        <div className="flex justify-between items-center mb-5">
          <p className="text-xs tracking-widest text-ocean-faint uppercase">Latest thoughts</p>
          <Link href="/blog" className="text-xs text-star-gold hover:text-star-pale transition-colors">
            view all →
          </Link>
        </div>
        <div className="flex flex-col">
          {posts.map(p => <BlogCard key={p.slug} post={p} />)}
        </div>
      </section>
    ) : null,
  }

  return (
    <div className="max-w-content mx-auto px-6">

      {/* Hero */}
      <section className="pt-16 pb-12">
        <p className="text-xs tracking-widest text-star-gold uppercase mb-4">
          {subheader}
        </p>
        <h1 className="text-4xl font-medium leading-snug mb-4 text-ink-primary">
          Hi, I&apos;m <span className="text-star-gold">Seyoun Kim</span>
          <br />{heroSubtitle}
        </h1>
        <p className="text-base text-ocean-muted leading-relaxed mb-7 max-w-lg">
          {description}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/projects"
            className="text-sm px-5 py-2.5 rounded-lg bg-star-gold text-[#100c00] font-medium hover:bg-star-pale transition-colors"
          >
            View Projects
          </Link>
          {chipLinks.map((chip, i) => (
            <a
              key={i}
              href={chip.href}
              target={chip.href.startsWith('http') ? '_blank' : undefined}
              rel={chip.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-sm px-4 py-2 rounded-lg border border-ocean-light/20 text-ink-muted hover:border-star-gold/50 hover:text-star-gold transition-colors"
            >
              {chip.label}
            </a>
          ))}
        </div>
      </section>

      {sectionOrder.map((key) => {
        const content = sections[key]
        if (!content) return null
        return (
          <div key={key}>
            <hr className="border-ocean-dim/20" />
            {content}
          </div>
        )
      })}

    </div>
  )
}
