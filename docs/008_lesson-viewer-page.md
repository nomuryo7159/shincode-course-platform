# 008: 動画視聴ページ（`/courses/[courseId]/lessons/[lessonId]`）

## 概要

YouTube 動画の埋め込み表示と、講座内の動画ナビゲーションを実装する。

## Todo

- [x] `/courses/[courseId]/lessons/[lessonId]/page.tsx` の実装
- [x] YouTube iframe 埋め込みコンポーネントの作成（`youtube-nocookie.com` ドメイン使用）
- [x] アクセス制御の実装（Lesson 1 は未ログインでも視聴可、それ以外は認証必須）
- [x] 未認証ユーザーが認証必須動画にアクセスした場合、`/login` へリダイレクト（リダイレクト元を `next` パラメータで保持）
- [x] サイドバー: 講座内の動画一覧表示（現在の動画をハイライト）
- [x] 前へ / 次へ ナビゲーションボタンの実装
- [x] 「完了にする」ボタンの実装（Server Action で progress を記録）
- [x] 完了済みの場合はボタンを完了状態で表示
- [x] レスポンシブ対応（モバイルではサイドバーを下部に配置等）
- [x] 存在しないレッスンの場合は `notFound()` を呼び出す
- [x] `loading.tsx` の作成
