import { createClient } from "@/lib/supabase/server"

type AdminUser = {
  id: string
  email: string
  avatar_url: string | null
  role: string
  created_at: string
  last_sign_in_at: string | null
}

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // Get all users via admin function
  const { data: users } = await supabase.rpc("get_users_for_admin")

  // Get total lesson count
  const { count: totalLessons } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })

  // Get progress for all users
  const { data: progressData } = await supabase
    .from("progress")
    .select("user_id")
    .eq("completed", true)

  // Count completions per user
  const completionsByUser = (progressData ?? []).reduce(
    (acc: Record<string, number>, row) => {
      acc[row.user_id] = (acc[row.user_id] ?? 0) + 1
      return acc
    },
    {}
  )

  return (
    <div>
      <h1 className="text-2xl font-bold">受講者管理</h1>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="pb-3 font-medium">メールアドレス</th>
              <th className="pb-3 font-medium">ロール</th>
              <th className="pb-3 font-medium">進捗</th>
              <th className="pb-3 font-medium">登録日</th>
              <th className="pb-3 font-medium">最終ログイン</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {((users ?? []) as AdminUser[]).map((user) => {
              const completed = completionsByUser[user.id] ?? 0
              return (
                <tr key={user.id}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt=""
                          className="h-6 w-6 rounded-full"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-gray-200" />
                      )}
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">
                    {completed} / {totalLessons ?? 0} 完了
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(user.created_at).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="py-3 text-gray-500">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString("ja-JP")
                      : "-"}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(users ?? []).length === 0 && (
          <p className="py-8 text-center text-gray-500">
            登録ユーザーがいません
          </p>
        )}
      </div>
    </div>
  )
}
