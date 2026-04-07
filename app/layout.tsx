import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Stars from '@/components/Stars'
import Planet from '@/components/Planet'
import ChatBot from '@/components/ChatBot'
import { getLandingSettings } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Your Name — Portfolio',
  description: 'Backend · AI · Solutions · Sales Engineer',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { gnb, footer } = await getLandingSettings()

  return (
    <html lang="en">
      <body className="bg-space-deep min-h-screen text-ink-primary relative">
        <Stars />
        <Planet />
        <div className="relative z-10">
          <Nav brandName={gnb} />
          <main>{children}</main>
          <footer className="border-t border-ocean-dim/30 py-6 pb-20 text-center text-xs text-white mt-16">
            {footer} &nbsp;
            <span className="text-star-gold">✦</span>
          </footer>
          <ChatBot />
        </div>
      </body>
    </html>
  )
}
