"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export function Sidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) return null

  const isMaster = user.role === "master"

  const masterLinks = [
    { href: "/home", label: "Home", icon: "🏠" },
    { href: "/times", label: "Times", icon: "👨‍👩‍👧‍👦" },
    { href: "/cadastro", label: "Cadastro", icon: "➕" },
    { href: "/tecnicos", label: "Técnicos", icon: "👥" },
    { href: "/dashboards", label: "Dashboards", icon: "📊" },
    { href: "/avaliacoes", label: "Avaliações", icon: "⭐" },
    { href: "/usuarios", label: "Usuários", icon: "🔐" },
  ]

  const operadorLinks = [
    { href: "/meu-desempenho", label: "Meu Desempenho", icon: "📈" },
    { href: "/historico", label: "Histórico", icon: "📜" },
  ]

  const links = isMaster ? masterLinks : operadorLinks

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-primary text-primary-foreground p-2 rounded-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-sidebar text-sidebar-foreground shadow-lg transform transition-transform duration-300 z-40 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-8">SisOp</h1>

          {/* User Info */}
          <div className="mb-8 pb-6 border-b border-sidebar-border">
            <p className="text-sm text-sidebar-foreground/80">Conectado como</p>
            <p className="font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/60 mt-1 uppercase">{isMaster ? "Master" : "Operador"}</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 mb-8">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-white font-semibold"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/20"
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
