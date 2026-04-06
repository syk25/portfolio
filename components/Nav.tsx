'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',         label: 'about'    },
  { href: '/projects', label: 'projects' },
  { href: '/blog',     label: 'blog'     },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="flex justify-between items-center px-6 py-5 border-b border-ocean-dim/20 max-w-content mx-auto w-full">
      <Link
        href="/"
        className="text-star-gold font-medium text-sm tracking-wide hover:text-star-pale transition-colors"
      >
        your name ✦
      </Link>
      <div className="flex gap-6">
        {links.map(l => (
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
      </div>
    </nav>
  )
}
