# 009: 視聴進捗管理

## 概要

ログイン済みユーザーの動画ごとの完了フラグを管理する Server Action とデータ取得ロジックを実装する。

## Todo

- [x] 進捗記録の Server Action 作成（`markLessonComplete`）
  - [x] 認証チェック
  - [x] `progress` テーブルに UPSERT（completed = true, completed_at = now()）
  - [x] `revalidatePath` でページを更新
- [x] 進捗取消の Server Action 作成（`markLessonIncomplete`）
- [x] ユーザーの講座別進捗率を取得するクエリの実装（完了数 / 全動画数）
- [x] 特定レッスンの完了状態を取得するクエリの実装
