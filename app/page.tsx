import Link from 'next/link'
import { getProjects } from '@/lib/content'
import { getBlogPosts } from '@/lib/content'
import { ProjectCard } from '@/components/ProjectCard'
import { BlogCard } from '@/components/ProjectCard'
import { LinkCard } from '@/components/ProjectCard'

const socialLinks = [
  { icon: 'yt', label: 'YouTube',  sub: 'My channel — thoughts on tech and life', href: 'https://youtube.com' },
  { icon: 'in', label: 'LinkedIn', sub: 'Professional background and experience',  href: 'https://linkedin.com' },
  { icon: 'gh', label: 'GitHub',   sub: 'Open source and personal experiments',    href: 'https://github.com'  },
]

const roles = ['Backend Engineer', 'AI Engineer', 'Solutions Architect', 'Sales Engineer']

const story = [
  { title: 'University',        body: 'Where I learned to think in systems and ask why before how.' },
  { title: 'Kenya',             body: 'Where I learned that technology only matters if it reaches real people.' },
  { title: 'What I believe',    body: 'Warmth and rigor aren\'t opposites. The best solutions have both.' },
  { title: 'Building toward',   body: 'A world where good engineering quietly makes life better.' },
]

export default async function Home() {
  const projects = (await getProjects()).slice(0, 2)
  const posts    = (await getBlogPosts()).slice(0, 3)

  return (
    <div className="max-w-content mx-auto px-6">

      {/* Hero */}
      <section className="pt-16 pb-12">
        <p className="text-xs tracking-widest text-star-gold uppercase mb-4">
          ✦ Backend · AI · Solutions · Sales
        </p>
        <h1 className="text-4xl font-medium leading-snug mb-4 text-ink-primary">
          Hi, I&apos;m <span className="text-star-gold">[Your Name]</span>
          <br />I build things that matter.
        </h1>
        <p className="text-base text-ocean-muted leading-relaxed mb-6 max-w-[520px]">
          From university labs to the fields of Kenya — I believe technology
          should serve people, not the other way around. I build with depth,
          curiosity, and warmth.
        </p>
        <div className="flex flex-wrap gap-2 mb-7">
          {roles.map(r => (
            <span
              key={r}
              className="text-[13px] px-3 py-1 rounded-full bg-ocean-light/10 border border-ocean-light/20 text-ocean-light"
            >
              {r}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <Link
            href="/projects"
            className="text-sm px-5 py-2.5 rounded-lg bg-star-gold text-[#100c00] font-medium hover:bg-star-pale transition-colors"
          >
            View Projects
          </Link>
          <Link
            href="/blog"
            className="text-sm px-5 py-2.5 rounded-lg border border-ocean-light/30 text-ocean-light hover:border-ocean-light/60 transition-colors"
          >
            Read My Blog
          </Link>
        </div>
      </section>

      <hr className="border-ocean-dim/20" />

      {/* Story */}
      <section className="py-10">
        <p className="text-xs tracking-widest text-ocean-faint uppercase mb-5">My story</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {story.map(s => (
            <div
              key={s.title}
              className="bg-space-card border border-ocean-light/10 rounded-xl p-4"
            >
              <h3 className="text-sm font-medium text-ink-secondary mb-1.5">{s.title}</h3>
              <p className="text-[13px] text-ink-faint leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-ocean-dim/20" />

      {/* Projects */}
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

      <hr className="border-ocean-dim/20" />

      {/* Social links */}
      <section className="py-10">
        <p className="text-xs tracking-widest text-ocean-faint uppercase mb-5">Find me</p>
        <div className="flex flex-col gap-2">
          {socialLinks.map(l => <LinkCard key={l.label} {...l} />)}
        </div>
      </section>

      <hr className="border-ocean-dim/20" />

      {/* Blog */}
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

    </div>
  )
}
