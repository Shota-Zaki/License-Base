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

これにより、License Base全体、Engineer-License-Lab単位、FE単位、単元単位の制御に対応できる。
