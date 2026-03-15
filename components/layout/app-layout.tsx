"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  LogOut, 
  Menu, 
  X, 
  Home,
  UserPlus,
  Star,
  Shield
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) {
    return <>{children}</>
  }

  const navItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/times", label: "Times", icon: Users },
    { href: "/cadastro", label: "Cadastro", icon: UserPlus },
    { href: "/tecnicos", label: "Técnicos", icon: Users },
    { href: "/dashboards", label: "Dashboards", icon: TrendingUp },
    { href: "/avaliacoes", label: "Avaliações", icon: Star },
    { href: "/usuarios", label: "Usuários", icon: Shield },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#262626] border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className={`${sidebarOpen ? "flex" : "hidden"} items-center gap-2`}>
            <span className="font-bold text-white text-xl">SKILL</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:bg-opacity-20 p-1 rounded transition-colors"
            aria-label={sidebarOpen ? "Fechar sidebar" : "Abrir sidebar"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#005486] text-white"
                      : "text-sidebar-foreground hover:bg-[#005486] hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 space-y-2">
          <div className={`${sidebarOpen ? "block" : "hidden"} text-xs text-sidebar-foreground mb-3`}>
            <div className="font-semibold">{user.name}</div>
            <div className="text-sidebar-foreground opacity-70">{user.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:bg-opacity-20 transition-colors text-sm"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card h-16 flex items-center justify-between px-6 border-b">
          <div></div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
