import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { GlobalSidebar } from '@/components/layout/global-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export const metadata: Metadata = {
  title: 'Airaa - Creator Rewards Platform',
  description: 'Discover guilds, join campaigns, and earn rewards for your content.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={GeistSans.className}>
        <AuthProvider>
          <TooltipProvider delayDuration={0}>
            <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
              <GlobalSidebar />
              <main className="flex-1 transition-all duration-200 overflow-y-auto overflow-x-hidden">{children}</main>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
