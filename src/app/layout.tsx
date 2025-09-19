import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Options Strategy Generator',
  description: 'AI-powered options strategy analysis and recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}