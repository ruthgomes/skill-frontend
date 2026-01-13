"use client"
import { useNotification } from "@/lib/notification-context"
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ToastContainer() {
  const { toasts, removeToast } = useNotification()

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-chart-1" />
      case "error":
        return <AlertCircle size={20} className="text-destructive" />
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-500" />
      default:
        return <Info size={20} className="text-primary" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-chart-1/10 border-chart-1/30"
      case "error":
        return "bg-destructive/10 border-destructive/30"
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30"
      default:
        return "bg-primary/10 border-primary/30"
    }
  }

  return (
    <div className="fixed bottom-4 right-4 space-y-3 pointer-events-none z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-lg border backdrop-blur-sm pointer-events-auto ${getBgColor(toast.type)} animate-in fade-in slide-in-from-right-4 duration-200`}
        >
          {getIcon(toast.type)}
          <span className="text-sm font-medium text-foreground flex-1">{toast.message}</span>
          <Button variant="ghost" size="icon" onClick={() => removeToast(toast.id)} className="h-6 w-6">
            <X size={16} />
          </Button>
        </div>
      ))}
    </div>
  )
}
