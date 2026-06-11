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

## 正答公開方針

- `GET /v1/questions/:id` と `GET /v1/practice-sets/:id` は回答前表示用なので、選択肢の `isCorrect` と解説本文を返さない。
- `POST /v1/practice-sets/:id/grade` は提出後表示用として、採点結果、正答、解説を返す。
- ログイン後の進捗保存は今後 `attempts` 系APIへ接続する。

未実装:

- 認証後の進捗保存
- 見直し
- 課金
- 管理画面系

## レスポンス方針

成功時は `data`、失敗時は `error` を返す。
