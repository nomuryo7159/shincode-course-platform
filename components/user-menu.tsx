"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { signOut } from "@/app/actions/auth"

type UserMenuProps = {
  email: string
  avatarUrl?: string
}

export function UserMenu({ email, avatarUrl }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full ring-2 ring-transparent hover:ring-[var(--color-primary)] transition-all cursor-pointer"
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt="" width={36} height={36} className="rounded-full" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-foreground)] text-sm font-bold text-white">
            {email[0]?.toUpperCase()}
          </div>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-lg border border-[var(--color-border)] bg-white py-2 shadow-xl animate-in fade-in slide-in-from-top-1">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <p className="text-sm font-bold text-[var(--color-foreground)]">
              {email}
            </p>
          </div>
          <form action={signOut} className="px-2 pt-2">
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)] transition-colors cursor-pointer"
            >
              ログアウト
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
