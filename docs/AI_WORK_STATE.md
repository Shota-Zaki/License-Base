# AI_WORK_STATE

## 現在状態

License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを継続中。`feat/mvp-foundation-v2` / PR #1 を起点に、進捗保存・見直し・権限確認のWeb UI接続まで完了済み。今回、復習対象のMVPライフサイクルを追加し、ダッシュボードから復習対象の3日後・7日後移動、完了扱い、手動追加見直しの削除を操作できる状態にした。GitHub Actions `MVP verification` run #49 は completed / success。この実行環境では外部DNS、pnpm、Dockerの制約が継続しているため、ローカル実行検証は未実行のまま成功扱いしない。

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
- 今後の作業引き渡しはZIP形式も併用する

## 今回作成・更新したもの

- `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を確認
- PR #1 の `open` / `draft` / `mergeable: true` を確認
- `packages/db/prisma/schema.prisma` を確認
  - `ReviewItem` は `reason` と `dueAt` を持つ
  - MVPではDBスキーマ変更なしで進める
- 復習対象のMVPライフサイクルAPIを追加
  - 復習対象の3日後・7日後移動は `dueAt` 更新で扱う
  - 完了扱いは内部状態を更新し、通常の見直し一覧から外す
  - 手動追加した見直しは既存のブックマーク操作で扱う
- ダッシュボードUIを更新
  - 復習対象: `3日後` / `7日後` / `完了`
  - 手動追加: `削除`
  - `dueAt` を日付表示
  - 操作中の二重操作を抑制
- `tools/license_base_smoke.sh` を拡張
  - 採点結果から不正解になる解答を作成
  - 復習対象生成を確認
  - 復習対象の3日後移動を確認
  - 復習対象の完了扱いを確認
  - ダッシュボード取得も継続確認
- `docs/REVIEW_WORKFLOW.md` を追加
  - 復習対象と手動見直しの扱い
  - 操作方針
  - 未実装事項
- GitHub Actions `MVP verification` run #49 を確認
  - completed / success
  - static-check: install / Prisma generate / typecheck / build success
  - integration: PostgreSQL service / install / Prisma generate / migrate / seed / API-Web起動 / API-Web待機 / 拡張HTTP smoke success

## 変更ファイル

- `apps/api/src/modules/me/me.controller.ts`
- `apps/web/lib/api.ts`
- `apps/web/app/engineer-license-lab/fe/dashboard/DashboardClient.tsx`
- `apps/web/app/globals.css`
- `tools/license_base_smoke.sh`
- `docs/REVIEW_WORKFLOW.md`
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
- 復習履歴・復習回数の正式管理
- 復習間隔の自動調整
- 管理画面の最小実装

## 保留

- Actionsでは `MVP verification` run #49 が frozen lockfile状態で成功したが、ローカル検証は未実行
- `pnpm-lock.yaml` はActions生成物をPR branchへ反映済みだが、ローカルでの `pnpm install --frozen-lockfile` は未実行
- workflow内の `pnpm db:migrate` はActions run #49で成功したが、正式なmigrationファイル運用は別途確認する
- ログイン必須APIは暫定的に `x-user-email` ヘッダーでユーザー識別している。本番認証確定後に差し替える
- `ProgressSnapshot` はMVP用の単元別最新提出サマリーとして更新している。累積集計・日次集計・弱点分析は未設計
- 復習対象の完了扱いはMVP用の内部状態。履歴・回数・再出題間隔は未設計
- `docs/API.md` の詳細追記は一部安全チェックで止まったため、今回の復習仕様は `docs/REVIEW_WORKFLOW.md` に分離して記録
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

- pnpm install: ローカル未実行 / Actions run #49で `--frozen-lockfile` 成功
- DB起動: ローカル未実行 / Actions PostgreSQL serviceはrun #49成功
- Prisma generate: ローカル未実行 / Actions run #49成功
- Prisma migrate: ローカル未実行 / Actions run #49成功
- seed実行: ローカル未実行 / Actions run #49成功
- API起動: ローカル未実行 / Actions run #49成功
- Web起動: ローカル未実行 / Actions run #49成功
- 実HTTP smoke: ローカル未実行 / Actions run #49成功
- ブラウザ確認: 未実行
- スマホ幅確認: 未実行
- GitHub Actions workflow: run #49 completed / success

## 次回作業

1. `feat/mvp-foundation-v2` / PR #1 を起点にする
2. `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を確認する
3. PR #1 の最新headとActions最新runを確認する
4. ネットワーク利用可能なローカル環境で `pnpm install --frozen-lockfile` を実行する
5. Docker PostgreSQLを起動する
6. Prisma generate / migrate / seed をローカル実行する
7. APIを起動し、主要エンドポイントを実HTTP確認する
8. Webを起動し、PC幅・スマホ幅で確認する
9. `bash tools/license_base_smoke.sh` をローカル実行する
10. FE Practice Labトップ、演習画面、ダッシュボードをブラウザ確認する
11. テキスト限定問題のvisualHtml非表示取込ルートを設計する
12. 管理画面、checkout / webhook、本番認証へ進む

## 推定完成度

- 企画・要件: 58%
- アーキテクチャ: 55%
- DB設計: 50%
- UI方針: 48%
- 実装: 62%
- 検証: 55%
- 引継ぎ整備: 99%

## 次回用短縮プロンプト

Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。`feat/mvp-foundation-v2` / PR #1 を起点に、License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを進めてください。前回、復習対象のMVPライフサイクルを追加しました。ダッシュボードでは復習対象に `3日後` / `7日後` / `完了`、手動追加した見直しに `削除` を表示します。API側では復習対象の後日移動を `dueAt` 更新で扱い、完了扱いはMVP用の内部状態として通常一覧から外します。`tools/license_base_smoke.sh` は不正解解答の生成、復習対象生成、3日後移動、完了扱い、ダッシュボード取得まで含む形に拡張済みです。`docs/REVIEW_WORKFLOW.md` に復習仕様を記録済みです。GitHub Actions `MVP verification` run #49 は completed / success です。ただし、この実行環境では外部DNS不可、pnpm未導入、Docker未導入のため、ローカルの pnpm install、DB起動、Prisma generate / migrate / seed、API/Web起動、実HTTP smoke、PC幅・スマホ幅確認は未実行です。未実行チェックは成功扱いせず、次はネットワーク利用可能なローカル環境で `pnpm install --frozen-lockfile` とローカル実行検証を進め、続いてFE Practice Labトップ・演習画面・ダッシュボードのPC幅/スマホ幅ブラウザ確認、テキスト限定問題のvisualHtml非表示取込ルート設計へ進めてください。最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプト、差分ZIPを出してください。
