import type { Metadata } from 'next'
import './globals.css'
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext'

export const metadata: Metadata = {
  title: 'VA Admin Agent',
  description: 'AI-powered email management assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-styrene antialiased">
        <SupabaseAuthProvider>
          {children}
        </SupabaseAuthProvider>
      </body>
    </html>
  )
}
