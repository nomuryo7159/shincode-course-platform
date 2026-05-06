# 003: Supabase クライアントユーティリティ

## 概要

ブラウザ用・サーバー用の Supabase クライアントユーティリティと Middleware を作成する。

## Todo

- [x] `lib/supabase/client.ts` の作成（ブラウザ用クライアント、`createBrowserClient` 使用）
- [x] `lib/supabase/server.ts` の作成（サーバー用クライアント、`createServerClient` 使用、Cookie 読み書き設定）
- [x] `proxy.ts` の作成（Next.js 16 で middleware → proxy にリネーム。トークンリフレッシュ、`supabase.auth.getUser()` の呼び出し）
- [x] Proxy の matcher 設定（静的ファイルを除外）
