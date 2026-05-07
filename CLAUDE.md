# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

YouTube限定公開動画を使った、Udemyライクな動画講座プラットフォーム（MVP）。
課金機能はPhase 2以降。認証はSupabase Auth（Google OAuthのみ）。

## コマンド

- `npm run dev` - 開発サーバー起動 (http://localhost:3000)
- `npm run build` - プロダクションビルド
- `npm run lint` - ESLint実行（フラットコンフィグ `eslint.config.mjs`）
- `npm start` - プロダクションサーバー起動

## 技術スタック

- **Next.js 16**（App Router）/ React 19 / TypeScript
- **Tailwind CSS v4**（`@tailwindcss/postcss` 経由、v3とは設定方法が異なる）
- **Supabase**（PostgreSQL / Auth / RLS）
- **デプロイ**: Vercel
- **動画**: YouTube限定公開（iframe埋め込み、`youtube-nocookie.com` 推奨）

## Next.js 16 注意事項

このバージョンはトレーニングデータと異なる破壊的変更がある可能性あり。
ルーティング・データ取得・Next.js APIに関わるコードを書く前に、必ず `node_modules/next/dist/docs/` の該当ガイドを確認すること。

## パスエイリアス

`@/*` → プロジェクトルート

## コンテンツ構造（3階層）

```
講座（Course）
└── セクション（Section）
    └── 動画（Lesson）
```

## データモデル

5テーブル構成（Supabase PostgreSQL、RLSで制御）:

- **profiles** - ユーザー情報（`id` = auth.users.id、`role`: 'student' | 'admin'）
- **courses** - 講座（title, description, thumbnail_url, is_published）
- **sections** - セクション（course_id, title, position で表示順管理）
- **lessons** - 動画（section_id, title, youtube_id, description, position）
- **progress** - 視聴進捗（user_id, lesson_id, completed, completed_at。UNIQUE(user_id, lesson_id)）

全テーブルの主キーはUUID。外部キーはON DELETE CASCADE。

## ルーティング

| パス                                     | 説明                     | 認証                           |
| ---------------------------------------- | ------------------------ | ------------------------------ |
| `/`                                      | 講座一覧（カード形式）   | 不要                           |
| `/courses/[courseId]`                    | 講座詳細・動画一覧       | 不要                           |
| `/courses/[courseId]/lessons/[lessonId]` | 動画視聴                 | Lesson 1は不要、それ以外は必要 |
| `/login`                                 | Google OAuthログイン     | 不要                           |
| `/admin`                                 | 管理トップ               | Admin必須                      |
| `/admin/courses`                         | 講座CRUD                 | Admin必須                      |
| `/admin/courses/[courseId]`              | セクション・動画CRUD     | Admin必須                      |
| `/admin/users`                           | 受講者一覧・進捗サマリー | Admin必須                      |

## アクセス制御

- **未ログイン**: 各講座の最初の動画（Lesson 1）のみ視聴可
- **ログイン済み**: 全動画視聴可
- **Admin**: `profiles.role = 'admin'` で判定、管理画面アクセス可
- 認証必須ページに未認証アクセス → `/login` にリダイレクト
- 非Adminが `/admin/*` アクセス → 403またはトップへリダイレクト

## 主要機能メモ

- 視聴進捗はユーザー手動マーク（「完了にする」ボタン）
- 動画視聴ページにサイドバーで講座内動画一覧を表示（現在の動画をハイライト）
- 前後の動画へのナビゲーション（前へ / 次へ）
- 講座詳細ページで進捗率表示（例: `3 / 10 完了`）
- 管理画面でセクション・動画の表示順管理（position）

## Next.js App Router ベストプラクティス

### Server Components / Client Components の使い分け

- コンポーネントはデフォルトで **Server Component**。`'use client'` は必要な箇所にのみ付与する
- **Server Component を使う場面**: データ取得、シークレットの使用、JSバンドル削減
- **Client Component を使う場面**: state（useState）、イベントハンドラ（onClick等）、useEffect、ブラウザAPI（localStorage等）
- `'use client'` はできるだけ末端のコンポーネントに付ける（バンドルサイズ最小化）
- Server Component から Client Component へはシリアライズ可能な props のみ渡せる
- Client Component の `children` に Server Component を渡すパターン（スロットパターン）を活用する

### データ取得

- Server Component 内で直接 `async/await` でデータ取得する（Supabaseクエリ等）
- `fetch` リクエストはデフォルトでキャッシュされない。キャッシュが必要な場合は `'use cache'` ディレクティブを使用
- 複数の独立したデータ取得は `Promise.all` で並列実行する
- 遅いデータ取得は `<Suspense>` で囲んでストリーミングする
- `loading.tsx` でルートセグメント全体のローディングUIを提供できる

### データ変更（Server Actions）

- `'use server'` ディレクティブで Server Action を定義する
- Client Component から使う場合は、別ファイル（例: `app/actions.ts`）にまとめてファイル先頭に `'use server'` を記述
- Server Action 内では必ず認証・認可チェックを行う（POSTリクエストで直接呼び出し可能なため）
- フォーム送信には `<form action={serverAction}>` を使う（プログレッシブエンハンスメント対応）
- 期待されるエラーは `useActionState` で戻り値として処理する（try/catch で throw しない）
- データ変更後は `revalidatePath` / `revalidateTag` でキャッシュを無効化する
- リダイレクトが必要な場合は `redirect()` を使う（revalidate の後に呼ぶ）
- ペンディング状態の表示には `useActionState` の `pending` を使う

### 動的パラメータ

- `params` は **Promise** として渡される。使用前に `await` が必要:
  ```tsx
  export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;
  }
  ```

### エラーハンドリング

- `error.tsx` でルートセグメントごとのエラーUIを定義する
- `not-found.tsx` で404ページを定義する
- Server Action の期待されるエラーは戻り値で返し、UIで表示する

### レイアウト

- 共有UIは `layout.tsx` に配置する（ナビゲーション、サイドバー等）
- レイアウトはナビゲーション間で状態を保持し、再レンダリングされない
- Context Provider は Client Component として作成し、layout から children を渡す

### リンク・ナビゲーション

- ページ遷移には `<Link>` コンポーネントを使用する（`<a>` タグではなく）
- プログラム的なナビゲーションには `useRouter`（Client Component）または `redirect`（Server Component / Server Action）を使用

## Supabase Auth（Next.js SSR）ルール

参照: https://supabase.com/docs/guides/auth/quickstarts/nextjs

### パッケージ

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 環境変数（`.env.local`）

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- `anon` キー（匿名キー）を使用する

### Supabase クライアント構成

`lib/supabase/` フォルダに以下の2種類のクライアントユーティリティを配置:

- **`client.ts`** - ブラウザ用（Client Components）: `createBrowserClient` を使用
- **`server.ts`** - サーバー用（Server Components / Route Handlers / Server Actions）: `createServerClient` を使用、Cookie の読み書きを設定

### Middleware（トークンリフレッシュ）

- `middleware.ts` をプロジェクトルートに配置し、全リクエストで認証トークンをリフレッシュする
- Next.js の Server Components は直接 Cookie を書き込めないため、Middleware 経由でリフレッシュされたトークンを設定する
- `supabase.auth.getUser()` を Middleware 内で呼び出してセッションを更新する

### 認証コールバック

- `/auth/callback` Route Handler を作成し、OAuth リダイレクト後の code exchange を処理する
- `supabase.auth.exchangeCodeForSession(code)` でセッションを確立

### セキュリティ上の重要ルール

- **サーバー側では `supabase.auth.getUser()` を使う**（JWTを検証する）
- `supabase.auth.getSession()` はサーバー側で信頼しない（JWT検証なしのため）
- Supabase クライアントはリクエストごとに新規作成する（軽量、Cookie の最新値を取得するため）
- ISR や CDN キャッシュ環境では `Set-Cookie` ヘッダーによるセッション漏洩に注意

### Cookie ベース認証の仕組み

- セッションは `sb-<project_ref>-auth-token` という名前の Cookie に保存される
- サーバー・クライアント間で同一セッションを共有
- Google OAuth ログイン後、Supabase がリダイレクトで認証コードを返し、callback route で exchange する

## MVP対象外（Phase 2以降）

課金（Stripe）、コメント、お気に入り、検索、修了証、Email/Passwordログイン、動画直接アップロード
