# 012: 管理画面 - セクション・動画管理（`/admin/courses/[courseId]`）

## 概要

特定の講座に紐づくセクションと動画（レッスン）のCRUD・並び替え機能を実装する。

## Todo

### セクション管理

- [x] `/admin/courses/[courseId]/page.tsx` の作成
- [x] セクション一覧の表示（position 順）
- [x] セクション作成フォーム（タイトル）
- [x] セクション作成の Server Action（`createSection`）
- [x] セクション編集の Server Action（`updateSection`）
- [x] セクション削除の Server Action（`deleteSection`、CASCADE で配下の動画も削除）
- [x] セクションの表示順変更（position の更新）

### 動画（レッスン）管理

- [x] 各セクション配下の動画一覧表示
- [x] 動画作成フォーム（タイトル、YouTube動画ID、説明文）
- [x] 動画作成の Server Action（`createLesson`）
  - [x] タイトル・YouTube動画ID の必須バリデーション
- [x] 動画編集の Server Action（`updateLesson`）
- [x] 動画削除の Server Action（`deleteLesson`）
- [x] 動画の表示順変更（position の更新）
