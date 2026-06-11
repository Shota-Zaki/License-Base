# AI_WORK_STATE

## 現在状態

License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを継続中。`feat/mvp-foundation-v2` / PR #1 を起点に、GitHub Actions `MVP verification` の失敗箇所を段階的に切り分け、Actions上では frozen lockfile 検証と拡張HTTP smokeが成功する状態。今回、進捗保存API・見直しAPI・権限APIをWeb UIへ接続し、FE Practice Lab ダッシュボードを追加した。コード変更を含む最新head `61f8ac938a4dc9d30e4aead7f55eb7e908d6f104` の Actions run #40 は completed / success。この実行環境では外部DNS、pnpm、Dockerの制約が継続しているため、ローカル実行検証は未実行のまま成功扱いしない。

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
- `docs/DESIGN.md` を確認し、学習ダッシュボード方針を追記
- PR #1 の `open` / `draft` / `mergeable: true` を再確認
- GitHub Actions `MVP verification` run #31 を確認
  - completed / success
  - 前回headの frozen lockfile状態検証は success
- FE Practice Labトップからダッシュボードへの導線を追加
- 演習画面を進捗保存APIへ接続
  - MVP用メール入力を追加
  - メール入力あり: attempt開始、解答保存、提出、採点結果表示、進捗保存
  - メール空欄: 公開採点APIのみ利用
  - 提出結果に「進捗保存済み」または「公開採点」バッジを表示
- 問題カードへ「見直しに追加」操作を追加
- FE Practice Lab ダッシュボードを追加
  - 回答数、正解数、正答率のサマリー
  - 単元別進捗
  - 見直し一覧
  - 権限確認
  - プラン確認
- `GET /v1/me/review-items` を補正
  - 不正解由来の復習対象と手動追加の見直しを同じ一覧で返す
  - 手動追加は `reason: bookmark` としてUIで区別
- `tools/license_base_smoke.sh` を拡張
  - 手動見直し追加
  - review-itemsの非空確認
  - Web FE dashboard取得
- `docs/API.md` を見直し表示方針に合わせて更新
- GitHub Actions `MVP verification` run #40 を確認
  - completed / success
  - static-check: install / Prisma generate / typecheck / build success
  - integration: PostgreSQL service / install / Prisma generate / migrate / seed / API-Web起動 / API-Web待機 / 拡張HTTP smoke success

## 変更ファイル

- `apps/api/src/modules/me/me.controller.ts`
- `apps/web/lib/api.ts`
- `apps/web/app/engineer-license-lab/fe/page.tsx`
- `apps/web/app/engineer-license-lab/fe/practice/[practiceSetId]/PracticeSetClient.tsx`
- `apps/web/app/engineer-license-lab/fe/dashboard/page.tsx`
- `apps/web/app/engineer-license-lab/fe/dashboard/DashboardClient.tsx`
- `apps/web/app/globals.css`
- `tools/license_base_smoke.sh`
- `docs/DESIGN.md`
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
- ダッシュボードの実ブラウザ確認
- 復習対象の完了・スヌーズ処理
- 手動見直し削除UIの安全な実装
- 管理画面の最小実装

## 保留

- Actionsでは `MVP verification` run #40 が frozen lockfile状態で成功したが、ローカル検証は未実行
- `pnpm-lock.yaml` はActions生成物をPR branchへ反映済みだが、ローカルでの `pnpm install --frozen-lockfile` は未実行
- workflow内の `pnpm db:migrate` はActions run #40で成功したが、正式なmigrationファイル運用は別途確認する
- ログイン必須APIは暫定的に `x-user-email` ヘッダーでユーザー識別している。本番認証確定後に差し替える
- `ProgressSnapshot` はMVP用の単元別最新提出サマリーとして更新している。累積集計・日次集計・弱点分析は未設計
- `GET /v1/me/review-items` は復習対象と手動追加を同居表示するMVP実装。完了・非表示・期限管理は未実装
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

- pnpm install: ローカル未実行 / Actions run #40で `--frozen-lockfile` 成功
- DB起動: ローカル未実行 / Actions PostgreSQL serviceはrun #40成功
- Prisma generate: ローカル未実行 / Actions run #40成功
- Prisma migrate: ローカル未実行 / Actions run #40成功
- seed実行: ローカル未実行 / Actions run #40成功
- API起動: ローカル未実行 / Actions run #40成功
- Web起動: ローカル未実行 / Actions run #40成功
- 実HTTP smoke: ローカル未実行 / Actions run #40成功
- ブラウザ確認: 未実行
- スマホ幅確認: 未実行
- GitHub Actions workflow: run #40 completed / success

## 次回作業

1. `feat/mvp-foundation-v2` / PR #1 を起点にする
2. PR #1 の最新headとActions最新runを確認する
3. ネットワーク利用可能なローカル環境で `pnpm install --frozen-lockfile` を実行する
4. Docker PostgreSQLを起動する
5. Prisma generate / migrate / seed をローカル実行する
6. APIを起動し、主要エンドポイントを実HTTP確認する
7. Webを起動し、PC幅・スマホ幅で確認する
8. `bash tools/license_base_smoke.sh` をローカル実行する
9. FE Practice Labトップ、演習画面、ダッシュボードをブラウザ確認する
10. 復習対象の完了・スヌーズ・削除仕様を決める
11. テキスト限定問題のvisualHtml非表示取込ルートを設計する
12. 管理画面、checkout / webhook、本番認証へ進む

## 推定完成度

- 企画・要件: 56%
- アーキテクチャ: 53%
- DB設計: 49%
- UI方針: 46%
- 実装: 58%
- 検証: 52%
- 引継ぎ整備: 99%

## 次回用短縮プロンプト

Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。`feat/mvp-foundation-v2` / PR #1 を起点に、License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを進めてください。前回、進捗保存API・見直しAPI・権限APIをWeb UIへ接続し、FE Practice Lab ダッシュボードを追加しました。演習画面ではMVP用メール入力ありの場合に `POST /v1/attempts`、`POST /v1/attempts/:attemptId/answers`、`POST /v1/attempts/:attemptId/submit` を使って進捗保存し、空欄の場合は公開採点のみ行います。問題カードには `POST /v1/me/bookmarks` による「見直しに追加」を接続しました。ダッシュボードでは `GET /v1/me/progress`、`GET /v1/me/review-items`、`GET /v1/me/entitlements`、`GET /v1/plans` を表示します。`GET /v1/me/review-items` は不正解由来の復習対象と手動追加の見直しを同じ一覧で返すよう補正済みです。`tools/license_base_smoke.sh` も手動見直し追加とWeb dashboard取得を含む形へ拡張済みです。GitHub Actions `MVP verification` run #40 は completed / success で、frozen lockfile状態の install、static-check、build、PostgreSQL service、Prisma migrate、seed、API/Web起動、API/Web待機、拡張HTTP smoke まで成功済みです。ただし、この実行環境では外部DNS不可、pnpm未導入、Docker未導入のため、ローカルの pnpm install、DB起動、Prisma generate / migrate / seed、API/Web起動、実HTTP smoke、PC幅・スマホ幅確認は未実行です。未実行チェックは成功扱いせず、次はネットワーク利用可能なローカル環境で `pnpm install --frozen-lockfile` とローカル実行検証を進め、続いてFE Practice Labトップ・演習画面・ダッシュボードのPC幅/スマホ幅ブラウザ確認と、復習対象の完了・スヌーズ仕様整理へ進めてください。最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプトを出してください。
