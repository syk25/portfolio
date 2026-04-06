import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Stars from '@/components/Stars'

export const metadata: Metadata = {
  title: 'Your Name — Portfolio',
  description: 'Backend · AI · Solutions · Sales Engineer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-space-deep min-h-screen text-ink-primary relative">
        <Stars />
        <div className="relative z-10">
          <Nav />
          <main>{children}</main>
          <footer className="border-t border-ocean-dim/30 py-6 text-center text-xs text-ink-dim mt-16">
            made with intention · not just code &nbsp;
            <span className="text-star-gold">✦</span>
          </footer>
        </div>
      </body>
    </html>
  )
}
