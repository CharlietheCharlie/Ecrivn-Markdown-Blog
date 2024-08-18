import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react"
import localFont from 'next/font/local'
import NavBar from './NavBar'
import { ThemeProvider } from './components/theme-provider';

const genyo = localFont({ src: '../public/fonts/GenYoGothicTW-M-01.ttf', variable: '--font-genyo' })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
  openGraph: {
    title: 'Create Next App',
    description: 'Generated by create next app',
    siteName: 'Create Next App',
    images: [
      {
        url: 'https://create-next-app.com/og.png',
        width: 1920,
        height: 1080,
      },
    ],
    locale: 'zh-TW',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={`${genyo.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <div className="flex flex-col min-h-screen">
              <NavBar />
              <main className="flex-grow container mx-auto py-20">
                <Toaster position="top-center" />
                {children}
              </main>
              <footer className="bg-gray-800 dark:bg-gray-700 text-white text-center py-4 transition-colors duration-300">
                &copy; {new Date().getFullYear()} Create Next App. All rights reserved.
              </footer>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
