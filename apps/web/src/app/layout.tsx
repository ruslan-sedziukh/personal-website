import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'mark-press app',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="h-full min-h-screen p-4 max-sm:pb-20 bg-neutral-50 w-full flex justify-center font-[family-name:var(--font-geist-sans)]">
          <div className="flex w-full lg:w-[1024px] sm:gap-4">{children}</div>
        </div>
      </body>
    </html>
  )
}
