# DB_SCHEMA

## 設計方針

FE Practice Lab専用ではなく、資格学習全般へ横展開できるスキーマにする。

## 主なテーブル

- users
- user_profiles
- labs
- certifications
- courses
- units
- lessons
- questions
- question_choices
- question_explanations
- question_sources
- practice_sets
- practice_set_questions
- attempts
- attempt_answers
- bookmarks
- review_items
- progress_snapshots
- plans
- subscriptions
- entitlements
- payment_events
- admin_audit_logs
- content_import_jobs

## ブランド階層

```txt
labs
 -> certifications
 -> courses
 -> units
 -> lessons / questions
```

## 出典・確認状態

`question_sources.verification_status` で以下を管理する。

- unverified
- official_checked
- original
- needs_review
- restricted

## 課金・権限

`entitlements` は以下のscopeを扱えるようにする。

- all
- lab
- certification
- course
- unit

Prisma上は `EntitlementScope` enumで保持し、API/UI表示時に必要な表記へ変換する。

## 進捗・復習

MVPの進捗保存は以下を土台にする。

- `attempts`: 演習開始・提出・点数集計
- `attempt_answers`: 問題ごとの回答
- `bookmarks`: 見直し登録
- `review_items`: 復習対象
- `progress_snapshots`: 単元別の進捗集計

未ログインのゲスト演習は画面上の閲覧・回答確認までとし、保存はログイン後に扱う。

## 管理・取込

- `admin_audit_logs`: 管理操作の監査ログ
- `content_import_jobs`: 既存問題データ投入やCSV取込の実行状態

問題本文、選択肢、正答、解説、公式確認状態は、確認できない限り自動で格上げしない。
