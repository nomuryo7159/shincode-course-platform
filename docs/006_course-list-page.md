# 006: 講座一覧ページ（`/`）

## 概要

トップページに公開中の講座をカード形式で一覧表示する。

## Todo

- [x] `/page.tsx` の実装（Server Component でデータ取得）
- [x] Supabase から公開講座一覧を取得するクエリの実装（`is_published = true`）
- [x] 講座カードコンポーネントの作成（タイトル、説明、サムネイル、総動画数）
- [x] 各講座の総動画数の取得（sections → lessons のカウント）
- [x] カードから講座詳細ページ（`/courses/[courseId]`）へのリンク
- [x] 講座が0件の場合の空状態表示
- [x] `loading.tsx` の作成（スケルトンUI）
