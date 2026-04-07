'use client'
import { useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { useParams } from 'next/navigation'

export default function Nav({ brandName }: { brandName: string }) {
  const t        = useTranslations('nav')
  const pathname = usePathname()
  const router   = useRouter()
  const params   = useParams()
  const locale   = params.locale as string

  function switchLocale(next: 'en' | 'ko') {
    router.replace(pathname, { locale: next })
  }

  const navLinks = [
    { href: '/'         as const, label: t('about')    },
    { href: '/projects' as const, label: t('projects') },
    { href: '/blog'     as const, label: t('blog')     },
  ]

  return (
    <nav className="flex justify-between items-center px-6 py-5 border-b border-ocean-dim/20 max-w-content mx-auto w-full">
      <Link
        href="/"
        className="text-star-gold font-medium text-sm tracking-wide hover:text-star-pale transition-colors"
      >
        {brandName}
      </Link>

      <div className="flex items-center gap-6">
        {navLinks.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`text-sm transition-colors ${
              pathname === l.href
                ? 'text-ink-primary'
                : 'text-ocean-muted hover:text-ink-secondary'
            }`}
          >
            {l.label}
          </Link>
        ))}

        {/* Locale switcher */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => switchLocale('en')}
            className={`transition-colors ${locale === 'en' ? 'text-star-gold font-medium' : 'text-ink-faint hover:text-ink-muted'}`}
          >
            EN
          </button>
          <span className="text-ink-faint/40">|</span>
          <button
            onClick={() => switchLocale('ko')}
            className={`transition-colors ${locale === 'ko' ? 'text-star-gold font-medium' : 'text-ink-faint hover:text-ink-muted'}`}
          >
            KO
          </button>
        </div>
      </div>
    </nav>
  )
}
