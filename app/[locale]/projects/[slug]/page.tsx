import { getTranslations } from 'next-intl/server'
import { getProject } from '@/lib/content'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/routing'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug }  = await params
  const t         = await getTranslations('projects')
  const project   = await getProject(slug)
  if (!project) notFound()

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <Link
        href="/projects"
        className="text-[11px] text-ocean-muted hover:text-ink-secondary transition-colors mb-8 inline-block"
      >
        {t('back')}
      </Link>

      <p className="text-[10px] text-star-gold mb-3">◆ {project.date}</p>
      <h1 className="text-3xl font-medium text-ink-primary mb-3">{project.title}</h1>
      <p className="text-[14px] text-ocean-muted mb-6">{project.description}</p>

      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map(tag => (
            <span key={tag} className="text-[11px] px-3 py-1 rounded-full bg-ocean-light/10 border border-ocean-light/20 text-ocean-light">
              {tag}
            </span>
          ))}
        </div>
      )}

      {(project.demo || project.github) && (
        <div className="flex gap-3 mb-10">
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer"
              className="text-[12px] px-4 py-2 rounded-lg bg-star-gold text-[#100c00] font-medium hover:bg-star-pale transition-colors">
              {t('liveDemo')}
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="text-[12px] px-4 py-2 rounded-lg border border-ocean-light/30 text-ocean-light hover:border-ocean-light/60 transition-colors">
              {t('github')}
            </a>
          )}
        </div>
      )}

      <hr className="border-ocean-dim/20 mb-10" />
      <article className="prose" dangerouslySetInnerHTML={{ __html: project.content }} />
    </div>
  )
}
