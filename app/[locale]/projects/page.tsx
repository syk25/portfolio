import { getTranslations } from 'next-intl/server'
import { getProjects } from '@/lib/content'
import { ProjectCard } from '@/components/ProjectCard'

export default async function ProjectsPage() {
  const t        = await getTranslations('projects')
  const projects = await getProjects()

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <p className="text-[10px] tracking-widest text-star-gold uppercase mb-2">◆ {t('label')}</p>
      <h1 className="text-3xl font-medium text-ink-primary mb-2">{t('title')}</h1>
      <p className="text-[14px] text-ocean-muted mb-10">{t('description')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map(p => <ProjectCard key={p.slug} project={p} />)}
      </div>
    </div>
  )
}
