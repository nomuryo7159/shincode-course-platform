# 002: Supabase データベーススキーマ構築

## 概要

Supabase 上に5テーブル（profiles, courses, sections, lessons, progress）を作成し、RLS ポリシーを設定する。

## Todo

- [x] `profiles` テーブルの作成（id, avatar_url, role, created_at）
- [x] `courses` テーブルの作成（id, title, description, thumbnail_url, is_published, created_at）
- [x] `sections` テーブルの作成（id, course_id, title, position, created_at）
- [x] `lessons` テーブルの作成（id, section_id, title, youtube_id, description, position, created_at）
- [x] `progress` テーブルの作成（id, user_id, lesson_id, completed, completed_at, UNIQUE(user_id, lesson_id)）
- [x] 外部キー制約の設定（ON DELETE CASCADE）
- [x] RLS の有効化（全テーブル）
- [x] RLS ポリシー: `profiles` - 自分のプロフィールのみ読み書き可能、Admin は全件読み取り可、emailとfull_nameはauth.usersからアクセスしてセキュリティ強化
- [x] RLS ポリシー: `courses` - 公開講座は誰でも読み取り可、Admin のみ書き込み可
- [x] RLS ポリシー: `sections` - 公開講座のセクションは誰でも読み取り可、Admin のみ書き込み可
- [x] RLS ポリシー: `lessons` - 公開講座のレッスンは誰でも読み取り可、Admin のみ書き込み可
- [x] RLS ポリシー: `progress` - 自分の進捗のみ読み書き可、Admin は全件読み取り可
- [x] Auth トリガー: 新規ユーザー登録時に `profiles` レコードを自動作成する関数の設定
