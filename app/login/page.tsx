import { Suspense } from "react"
import { LoginForm } from "./login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ログイン | コースプラットフォーム",
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
