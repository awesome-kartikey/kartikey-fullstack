import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TeamHub',
  description: 'Local team intranet capstone',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="mx-auto min-h-screen max-w-6xl px-6 py-10">
          {children}
        </div>
      </body>
    </html>
  )
}
