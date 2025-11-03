import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Generative UI Charts - AI Powered',
  description: 'Crie gráficos interativos usando inteligência artificial - Guia de implementação com Next.js e OpenAI',
  keywords: 'charts, ai, generative ui, nextjs, openai, gráficos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
