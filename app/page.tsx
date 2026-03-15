"use client"

import { useAuth } from "@/core/contexts"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LoginPage from "./login/page"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/home")
    }
  }, [user, router])

  return user ? null : <LoginPage />
}
