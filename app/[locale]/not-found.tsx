import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <div className="max-w-content mx-auto px-6 py-32 text-center">
      <p className="text-[10px] tracking-widest text-star-gold uppercase mb-4">◆ {t('label')}</p>
      <h1 className="text-3xl font-medium text-ink-primary mb-4">{t('title')}</h1>
      <p className="text-[14px] text-ocean-muted mb-8">{t('description')}</p>
      <Link
        href="/"
        className="inline-block text-[13px] px-5 py-2.5 rounded-lg bg-star-gold text-[#100c00] font-medium hover:bg-star-pale transition-colors"
      >
        {t('back')}
      </Link>
    </div>
  )
}
