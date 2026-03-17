import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'CRM SaaS',
  description: 'Application CRM SaaS',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}