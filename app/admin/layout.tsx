import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/admin")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="lg:flex lg:gap-8">
        <AdminSidebar />
        <div className="mt-6 flex-1 lg:mt-0">{children}</div>
      </div>
    </div>
  )
}
