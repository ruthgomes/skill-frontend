"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { useAuth } from "@/lib/auth-context"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  if (!user) {
    return children
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-64 overflow-auto pt-16 lg:pt-0">
        <div className="p-6 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
