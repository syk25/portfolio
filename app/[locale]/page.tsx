import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { getProjects, getBlogPosts, getLandingSettings } from '@/lib/content'
import { ProjectCard } from '@/components/ProjectCard'
import { BlogCard } from '@/components/ProjectCard'
import { LinkCard } from '@/components/ProjectCard'

const socialIconMap: Record<string, string> = { yt: 'yt', in: 'in', gh: 'gh' }

export default async function Home() {
  const t = await getTranslations('home')

  const projects                           = (await getProjects()).slice(0, 2)
  const posts                              = (await getBlogPosts()).slice(0, 3)
  const { subheader, heroSubtitle, description } = await getLandingSettings()

  const storyItems = t.raw('story.items') as Array<{ title: string; body: string }>

  const socialLinks = [
    { icon: socialIconMap.yt, label: 'YouTube',  sub: t('social.yt'), href: 'https://youtube.com' },
    { icon: socialIconMap.in, label: 'LinkedIn', sub: t('social.in'), href: 'https://linkedin.com' },
    { icon: socialIconMap.gh, label: 'GitHub',   sub: t('social.gh'), href: 'https://github.com'  },
  ]

  return (
    <div className="max-w-content mx-auto px-6">

      {/* Hero */}
      <section className="pt-16 pb-12">
        <p className="text-xs tracking-widest text-star-gold uppercase mb-4">
          {subheader}
        </p>
        <h1 className="text-4xl font-medium leading-snug mb-4 text-ink-primary">
          {t('hero.greeting')} <span className="text-star-gold">Seyoun Kim</span>
          <br />{heroSubtitle}
        </h1>
        <p className="text-base text-ocean-muted leading-relaxed mb-7 max-w-lg">
          {description}
        </p>
        <Link
          href="/projects"
          className="text-sm px-5 py-2.5 rounded-lg bg-star-gold text-[#100c00] font-medium hover:bg-star-pale transition-colors"
        >
          {t('hero.cta')}
        </Link>
      </section>

      <hr className="border-ocean-dim/20" />

      {/* Story */}
      <section className="py-10">
        <p className="text-xs tracking-widest text-ocean-faint uppercase mb-5">{t('story.label')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {storyItems.map(s => (
            <div
              key={s.title}
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

      <hr className="border-ocean-dim/20" />

      {/* Projects */}
      <section className="py-10">
        <div className="flex justify-between items-center mb-5">
          <p className="text-xs tracking-widest text-ocean-faint uppercase">{t('projects.label')}</p>
          <Link href="/projects" className="text-xs text-star-gold hover:text-star-pale transition-colors">
            {t('projects.viewAll')}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map(p => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>

      <hr className="border-ocean-dim/20" />

      {/* Social links */}
      <section className="py-10">
        <p className="text-xs tracking-widest text-ocean-faint uppercase mb-5">{t('social.label')}</p>
        <div className="flex flex-col gap-2">
          {socialLinks.map(l => <LinkCard key={l.label} {...l} />)}
        </div>
      </section>

      <hr className="border-ocean-dim/20" />

      {/* Blog */}
      <section className="py-10">
        <div className="flex justify-between items-center mb-5">
          <p className="text-xs tracking-widest text-ocean-faint uppercase">{t('blog.label')}</p>
          <Link href="/blog" className="text-xs text-star-gold hover:text-star-pale transition-colors">
            {t('blog.viewAll')}
          </Link>
        </div>
        <div className="flex flex-col">
          {posts.map(p => <BlogCard key={p.slug} post={p} />)}
        </div>
      </section>

    </div>
  )
}
