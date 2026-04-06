import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider, NotificationProvider } from "@/core/contexts"
import { ThemeProvider } from "@/shared/components/common"
import { SonnerToaster } from "@/shared/components/ui/sonner"
import "./globals.css"

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist",
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "SkillFix - Sistema de Desempenho de Colaboradores",
  description: "Gerenciamento profissional de desempenho e avaliação de habilidades",
  keywords: ["desempenho", "avaliação", "colaboradores", "skills", "gestão"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationProvider>
            <AuthProvider>
              {children}
              <SonnerToaster position="top-right" richColors />
            </AuthProvider>
          </NotificationProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
