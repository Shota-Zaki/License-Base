# API

## Public

```txt
GET /v1/health
GET /v1/labs
GET /v1/courses/:courseSlug
GET /v1/questions/sample
GET /v1/questions/:questionId
```

## Practice

```txt
GET  /v1/practice-sets
GET  /v1/practice-sets/:id
POST /v1/practice-sets/:id/grade
GET  /v1/questions/:id
POST /v1/attempts
POST /v1/attempts/:attemptId/answers
POST /v1/attempts/:attemptId/submit
GET  /v1/attempts/:attemptId/result
```

## Progress

```txt
GET  /v1/me/progress
GET  /v1/me/review-items
POST /v1/me/bookmarks
DELETE /v1/me/bookmarks/:bookmarkId
```

## Billing

```txt
GET  /v1/me/entitlements
GET  /v1/plans
POST /v1/billing/checkout
POST /v1/billing/webhook
```

## Admin

```txt
GET    /v1/admin/questions
POST   /v1/admin/questions
GET    /v1/admin/questions/:id
PATCH  /v1/admin/questions/:id
POST   /v1/admin/questions/:id/publish
POST   /v1/admin/questions/:id/archive
POST   /v1/admin/import-jobs
GET    /v1/admin/import-jobs
```

## 現在のMVP実装状態

DB接続済み:

- `GET /v1/health`
- `GET /v1/labs`
- `GET /v1/courses/:courseSlug`
- `GET /v1/questions/sample`
- `GET /v1/questions/:questionId`
- `GET /v1/practice-sets`
- `GET /v1/practice-sets/:id`
- `POST /v1/practice-sets/:id/grade`
- `POST /v1/attempts`
- `POST /v1/attempts/:attemptId/answers`
- `POST /v1/attempts/:attemptId/submit`
- `GET /v1/attempts/:attemptId/result`
- `GET /v1/me/progress`
- `GET /v1/me/review-items`
- `POST /v1/me/bookmarks`
- `DELETE /v1/me/bookmarks/:bookmarkId`
- `GET /v1/me/entitlements`
- `GET /v1/plans`

## 認証前提

MVP段階では本番認証プロバイダ未確定のため、ログイン必須APIは暫定的に `x-user-email` ヘッダーでユーザーを識別する。

対象:

- `POST /v1/attempts`
- `POST /v1/attempts/:attemptId/answers`
- `POST /v1/attempts/:attemptId/submit`
- `GET /v1/attempts/:attemptId/result`
- `GET /v1/me/progress`
- `GET /v1/me/review-items`
- `POST /v1/me/bookmarks`
- `DELETE /v1/me/bookmarks/:bookmarkId`
- `GET /v1/me/entitlements`

## 正答公開方針

- `GET /v1/questions/:id` と `GET /v1/practice-sets/:id` は回答前表示用なので、選択肢の `isCorrect` と解説本文を返さない。
- `POST /v1/practice-sets/:id/grade` は提出後表示用として、採点結果、正答、解説を返す。
- `GET /v1/attempts/:attemptId/result` は提出前には正答・解説を返さず、提出後のみ正答・解説を返す。
- `POST /v1/attempts/:attemptId/submit` は提出後表示用として、採点結果、正答、解説を返し、不正解問題を復習対象へ追加する。

## 見直し表示方針

- `POST /v1/me/bookmarks` は手動の見直し追加として扱う。
- `POST /v1/attempts/:attemptId/submit` は不正解問題を復習対象として追加する。
- `GET /v1/me/review-items` は、不正解由来の復習対象と手動追加の見直しを同じ一覧で返す。
- `reason: bookmark` の行は手動追加、その他の行は復習対象としてUIで区別する。
- `DELETE /v1/me/bookmarks/:bookmarkId` は手動追加行の削除用。復習対象の削除・完了処理は未実装。

未実装:

- 本番認証
- 決済checkout / webhook
- 管理画面系
- 復習対象の完了・スヌーズ

## レスポンス方針

成功時は `data`、失敗時は `error` を返す。
