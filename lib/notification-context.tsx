"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { generateShortId } from "./id-generator"
import { toast } from "sonner"

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
}

interface NotificationContextType {
  toasts: Toast[]
  addToast: (message: string, type: Toast["type"], duration?: number) => void
  removeToast: (id: string) => void
  // Helpers simplificados
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: Toast["type"], duration = 5000) => {
    const id = generateShortId()
    const newToast: Toast = { id, message, type, duration }

    setToasts((prev) => [...prev, newToast])

    // Usar sonner para mostrar o toast
    switch (type) {
      case "success":
        toast.success(message, { duration })
        break
      case "error":
        toast.error(message, { duration })
        break
      case "warning":
        toast.warning(message, { duration })
        break
      case "info":
      default:
        toast.info(message, { duration })
        break
    }

    if (duration) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [removeToast])

  // Helpers simplificados
  const success = useCallback((message: string, duration?: number) => {
    addToast(message, "success", duration)
  }, [addToast])

  const error = useCallback((message: string, duration?: number) => {
    addToast(message, "error", duration)
  }, [addToast])

  const info = useCallback((message: string, duration?: number) => {
    addToast(message, "info", duration)
  }, [addToast])

  const warning = useCallback((message: string, duration?: number) => {
    addToast(message, "warning", duration)
  }, [addToast])

  return (
    <NotificationContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider")
  }
  return context
}
