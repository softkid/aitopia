import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata, Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AITOPIA - AI 수익화 플랫폼',
  description: 'AI를 활용한 자동화 프로세스로 수익을 창출하는 혁신적인 플랫폼',
  keywords: ['AI', '자동화', '수익', 'USDT', '암호화폐', 'ZK증명'],
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
    icon: '/icon-192x192.png',
    shortcut: '/icon-192x192.png',
    apple: '/icon-192x192.png',
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
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 dark:bg-gray-900`}>
        <div id="root" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
} 