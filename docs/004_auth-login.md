# 004: 認証 - ログインページ・コールバック

## 概要

Google OAuth によるログイン機能を実装する。ログインページ（`/login`）と認証コールバック（`/auth/callback`）を作成する。

## Todo

- [x] `/login/page.tsx` の作成（「Googleでログイン」ボタン）
- [x] Google OAuth のサインイン処理の実装（`supabase.auth.signInWithOAuth`、リダイレクト先の設定）
- [x] `/auth/callback/route.ts` の作成（code exchange 処理、`exchangeCodeForSession`）
- [x] ログイン後のリダイレクト処理（元のページへ戻る、`next` クエリパラメータ対応）
- [x] ログアウト処理の実装（Server Action、`supabase.auth.signOut`）
- [x] Supabase ダッシュボードで Google OAuth プロバイダーの設定
- [x] リダイレクト URL の設定（Supabase ダッシュボード側）
