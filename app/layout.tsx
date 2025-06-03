import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata, Viewport } from 'next'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AITOPIA - AI 수익화 플랫폼',
  description: 'ZK 알고리즘 기반 익명 AI 수익화 플랫폼',
  keywords: 'AI, 수익화, 블록체인, USDT, 자동화',
  authors: [{ name: 'AITOPIA Team' }],
  creator: 'AITOPIA',
  publisher: 'AITOPIA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>',
    shortcut: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AITOPIA',
  },
  openGraph: {
    type: 'website',
    siteName: 'AITOPIA',
    title: 'AITOPIA - AI 수익화 플랫폼',
    description: 'AI를 활용한 자동화 프로세스로 수익을 창출하는 혁신적인 플랫폼',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AITOPIA - AI 수익화 플랫폼',
    description: 'AI를 활용한 자동화 프로세스로 수익을 창출하는 혁신적인 플랫폼',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'theme-color': '#3b82f6'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0284c7' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 dark:bg-gray-900`}>
        <Providers>
          <div id="root" className="min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
} 