import { getProjects } from '@/lib/content'
import { ProjectCard } from '@/components/ProjectCard'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <p className="text-[10px] tracking-widest text-star-gold uppercase mb-2">✦ Work</p>
      <h1 className="text-3xl font-medium text-ink-primary mb-2">Projects</h1>
      <p className="text-[14px] text-ocean-muted mb-10">
        Things I&apos;ve built — real problems, real people.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projects.map(p => <ProjectCard key={p.slug} project={p} />)}
      </div>
    </div>
  )
}
