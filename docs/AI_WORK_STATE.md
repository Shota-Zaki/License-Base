# AI_WORK_STATE

## 現在状態

License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを継続中。`feat/mvp-foundation-v2` / PR #1 を起点に、GitHub Actions `MVP verification` の失敗箇所を段階的に切り分け、Actions上では `pnpm-lock.yaml` 追加後の frozen lockfile 検証まで成功する状態に到達済み。今回、認証後の進捗保存・見直し・課金権限確認のMVP API土台を追加し、Actions run #27 で install / typecheck / build / PostgreSQL service / Prisma migrate / seed / API-Web起動 / HTTP smoke まで成功した。この実行環境では外部DNS、pnpm、Dockerの制約が継続しているため、ローカル実行検証は未実行のまま成功扱いしない。

## 確定方針

- Web MVPから開始
- PWAは次段階
- Expoアプリは将来対応
- 初期対象は FE Practice Lab
- 公式情報 + オリジナル問題・解説
- 課金土台はMVPから入れる
- ゲスト閲覧可
- 進捗保存はログイン必須
- App Store / Google Play公開は初期対象外

## 今回作成・更新したもの

- `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を確認
- PR #1 の `open` / `draft` / `mergeable: true` を再確認
- GitHub Actions `MVP verification` run #20 を確認
  - completed / success
  - frozen lockfile状態で `Install dependencies` は success
  - static-check / build / integration / HTTP smoke は success
- 認証後APIの暫定ユーザー識別を追加
  - MVP段階では本番認証プロバイダ未確定のため、ログイン必須APIは `x-user-email` ヘッダーでユーザーを識別する
  - 未ログイン扱いの場合は `LOGIN_REQUIRED` を返す
- 進捗保存APIを追加
  - `POST /v1/attempts`
  - `POST /v1/attempts/:attemptId/answers`
  - `POST /v1/attempts/:attemptId/submit`
  - `GET /v1/attempts/:attemptId/result`
  - 提出前のresultでは正答・解説を返さず、提出後のみ返す
  - 提出時に単元別 `ProgressSnapshot` を更新する
- 見直し・復習APIを追加
  - `GET /v1/me/progress`
  - `GET /v1/me/review-items`
  - `POST /v1/me/bookmarks`
  - `DELETE /v1/me/bookmarks/:bookmarkId`
  - 提出時の不正解問題を `ReviewItem` に追加する
- 課金権限APIの土台を追加
  - `GET /v1/plans`
  - `GET /v1/me/entitlements`
  - checkout / webhook は未実装のまま保留
- `tools/license_base_smoke.sh` を拡張
  - plans取得
  - entitlements取得
  - attempt開始
  - attempt answers保存
  - attempt提出
  - attempt result取得
  - progress取得
  - review-items取得
- `docs/API.md` を現行MVP API実装状態に更新
- GitHub Actions `MVP verification` run #27 を確認
  - completed / success
  - static-check: install / Prisma generate / typecheck / build success
  - integration: PostgreSQL service / install / Prisma generate / migrate / seed / API-Web起動 / API-Web待機 / HTTP smoke success

## 変更ファイル

- `apps/api/src/app.module.ts`
- `apps/api/src/modules/auth/user-context.ts`
- `apps/api/src/modules/attempts/attempts.controller.ts`
- `apps/api/src/modules/me/me.controller.ts`
- `apps/api/src/modules/plans/plans.controller.ts`
- `tools/license_base_smoke.sh`
- `docs/API.md`
- `docs/AI_WORK_STATE.md`

## 未完了

- ローカルでの `pnpm install --frozen-lockfile`
- ローカルDB起動
- ローカルPrisma generate / migrate / seed
- ローカルAPI実起動
- ローカルWeb実起動
- ローカル実HTTP smoke
- PC幅ブラウザ確認
- スマホ幅確認
- 認証プロバイダ確定
- 本番認証への差し替え
- 決済プロバイダ詳細設定
- checkout / webhook 実装
- 既存問題データの全件投入形式確認
- 既存問題データの品質確認
- 進捗APIのWeb UI接続
- 見直し・復習APIのWeb UI接続
- 課金権限APIのWeb UI接続
- 管理画面の最小実装

## 保留

- Actionsでは `MVP verification` run #27 が frozen lockfile状態で成功したが、ローカル検証は未実行
- `pnpm-lock.yaml` はActions生成物をPR branchへ反映済みだが、ローカルでの `pnpm install --frozen-lockfile` は未実行
- workflow内の `pnpm db:migrate` はActions run #27で成功したが、正式なmigrationファイル運用は別途確認する
- ログイン必須APIは暫定的に `x-user-email` ヘッダーでユーザー識別している。本番認証確定後に差し替える
- `ProgressSnapshot` はMVP用の単元別最新提出サマリーとして更新している。累積集計・日次集計・弱点分析は未設計
- UIの最終ビジュアル詳細
- Free / Basic の価格
- 無料公開する問題数
- 既存問題データの品質確認
- 管理者権限の詳細
- 本番ホスティング先
- 認証プロバイダの最終選定
- 決済プロバイダの本番設定
- `env.example` を `.env` の雛形として運用中
- テキスト限定1032問はvisualHtml非表示ルート実装後に投入
- 正答未確定286問は出題不可
- 自動生成200問は公式問題と分離しレビュー待ち
- この実行環境では外部DNSの名前解決に失敗
- この実行環境では `pnpm` と Docker が未導入

## 未実行チェック

- pnpm install: ローカル未実行 / Actions run #27で `--frozen-lockfile` 成功
- DB起動: ローカル未実行 / Actions PostgreSQL serviceはrun #27成功
- Prisma generate: ローカル未実行 / Actions run #27成功
- Prisma migrate: ローカル未実行 / Actions run #27成功
- seed実行: ローカル未実行 / Actions run #27成功
- API起動: ローカル未実行 / Actions run #27成功
- Web起動: ローカル未実行 / Actions run #27成功
- 実HTTP smoke: ローカル未実行 / Actions run #27成功
- ブラウザ確認: 未実行
- スマホ幅確認: 未実行
- GitHub Actions workflow: run #27 completed / success

## 次回作業

1. `feat/mvp-foundation-v2` / PR #1 を起点にする
2. PR #1 の最新headとActions最新runを確認する
3. ネットワーク利用可能なローカル環境で `pnpm install --frozen-lockfile` を実行する
4. Docker PostgreSQLを起動する
5. Prisma generate / migrate / seed をローカル実行する
6. APIを起動し、主要エンドポイントを実HTTP確認する
7. Webを起動し、PC幅・スマホ幅で確認する
8. `bash tools/license_base_smoke.sh` をローカル実行する
9. FE Practice Labトップ、演習画面、回答選択、採点結果表示をブラウザ確認する
10. 進捗保存API・見直しAPI・権限APIをWeb UIへ接続する
11. テキスト限定問題のvisualHtml非表示取込ルートを設計する
12. 管理画面、checkout / webhook、本番認証へ進む

## 推定完成度

- 企画・要件: 52%
- アーキテクチャ: 50%
- DB設計: 48%
- UI方針: 37%
- 実装: 50%
- 検証: 48%
- 引継ぎ整備: 99%

## 次回用短縮プロンプト

Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。`feat/mvp-foundation-v2` / PR #1 を起点に、License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを進めてください。前回、認証後の進捗保存・見直し・課金権限確認のMVP API土台を追加しました。MVP段階ではログイン必須APIを暫定的に `x-user-email` ヘッダーで識別します。追加済みAPIは `POST /v1/attempts`、`POST /v1/attempts/:attemptId/answers`、`POST /v1/attempts/:attemptId/submit`、`GET /v1/attempts/:attemptId/result`、`GET /v1/me/progress`、`GET /v1/me/review-items`、`POST /v1/me/bookmarks`、`DELETE /v1/me/bookmarks/:bookmarkId`、`GET /v1/plans`、`GET /v1/me/entitlements` です。`tools/license_base_smoke.sh` もこれらを含む形へ拡張済みです。GitHub Actions `MVP verification` run #27 は completed / success で、frozen lockfile状態の install、static-check、build、PostgreSQL service、Prisma migrate、seed、API/Web起動、API/Web待機、拡張HTTP smoke まで成功済みです。ただし、この実行環境では外部DNS不可、pnpm未導入、Docker未導入のため、ローカルの pnpm install、DB起動、Prisma generate / migrate / seed、API/Web起動、実HTTP smoke、PC幅・スマホ幅確認は未実行です。未実行チェックは成功扱いせず、次はネットワーク利用可能なローカル環境で `pnpm install --frozen-lockfile` とローカル実行検証を進め、続いて進捗保存API・見直しAPI・権限APIをWeb UIへ接続してください。最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプトを出してください。
