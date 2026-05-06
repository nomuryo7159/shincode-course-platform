# 011: 管理画面 - 講座管理（`/admin/courses`）

## 概要

講座の一覧表示・作成・編集・削除（CRUD）機能を実装する。

## Todo

- [x] `/admin/courses/page.tsx` の作成（講座一覧テーブル）
- [x] 講座一覧の取得（全講座、公開/非公開含む）
- [x] 講座作成フォームの実装（タイトル、説明文、サムネイルURL、公開フラグ）
- [x] 講座作成の Server Action（`createCourse`）
  - [x] 入力バリデーション（タイトル必須）
  - [x] Supabase への INSERT
  - [x] 作成後のリダイレクト
- [x] 講座編集フォームの実装
- [x] 講座更新の Server Action（`updateCourse`）
- [x] 講座削除の Server Action（`deleteCourse`）
  - [x] 確認ダイアログの表示
  - [x] CASCADE により関連セクション・動画も削除される旨の注意表示
- [x] 公開/非公開の切り替え機能
