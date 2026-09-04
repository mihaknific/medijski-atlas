import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'Medijski Atlas | Pregled slovenskega medijskega prostora',
  description: 'Izobraževalno orodje za medijsko pismenost. Analizirajte politično pristranskost, zanesljivost dejstev in lastniške strukture slovenskih medijev.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Medijski Atlas',
    description: 'Analizirajte politično pristranskost, zanesljivost in lastniške strukture slovenskih medijev.',
    type: 'website',
    locale: 'sl_SI',
    siteName: 'Medijski Atlas',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medijski Atlas',
    description: 'Analizirajte politično pristranskost, zanesljivost in lastniške strukture slovenskih medijev.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sl" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
