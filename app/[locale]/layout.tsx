import type { Metadata } from 'next'
import '../globals.css'
import Nav from '@/components/Nav'
import Stars from '@/components/Stars'
import Planet from '@/components/Planet'
import ChatBot from '@/components/ChatBot'
import { getLandingSettings } from '@/lib/content'
import { routing } from '@/i18n/routing'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Seyoun Kim | Portfolio',
  description: 'Backend · AI · Solutions · Sales Engineer',
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!(routing.locales as readonly string[]).includes(locale)) notFound()

  const messages          = await getMessages()
  const { gnb, footer }   = await getLandingSettings()

  return (
    <html lang={locale}>
      <body className="bg-space-deep min-h-screen text-ink-primary relative">
        <NextIntlClientProvider messages={messages}>
          <Stars />
          <Planet />
          <div className="relative z-10">
            <Nav brandName={gnb} />
            <main>{children}</main>
            <footer className="border-t border-ocean-dim/30 py-6 pb-20 text-center text-xs text-white mt-16">
              {footer} &nbsp;
              <span className="text-star-gold">◆</span>
            </footer>
            <ChatBot />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
