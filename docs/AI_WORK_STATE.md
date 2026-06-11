# AI_WORK_STATE

## 現在状態

License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを継続中。`feat/mvp-foundation-v2` / PR #1 を起点に、GitHub Actions `MVP verification` の失敗箇所を段階的に切り分けた。この実行環境では外部DNS、pnpm、Dockerの制約が継続しているため、ローカル実行検証は未実行のまま成功扱いしない。Actions上では、pnpm導入、依存インストール、Prisma generate / migrate / seed まで到達した。現在の主な未解決は typecheck failure。

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
- GitHub Actions `MVP verification` run #4 を確認
  - completed / failure
  - `Install pnpm` は success
  - `Install dependencies` は failure
- GitHub Actions `MVP verification` run #6 を確認
  - completed / failure
  - `Install dependencies` は success
  - `Generate Prisma client` は failure
- GitHub Actions `MVP verification` run #7 を確認
  - `Install dependencies` は success
  - `Generate Prisma client` は success
  - `Run Prisma migration` は success
  - `Seed database` は success
  - `Typecheck` は failure
- GitHub Actions `MVP verification` run #8 を確認
  - completed / failure
  - 詳細stepの再取得は未完了
- `package.json` を更新
  - `packageManager` を `pnpm@latest` から `pnpm@10.0.0` へ固定
- `.github/workflows/mvp-verification.yml` を更新
  - `PNPM_VERSION: "10.0.0"` を追加
  - `npm install -g pnpm@${PNPM_VERSION}` へ変更
- `packages/db/package.json` を更新
  - `@prisma/client` を `5.22.0` へ固定
  - `prisma` を `5.22.0` へ固定
  - `@types/node` を追加

## 変更ファイル

- `package.json`
- `.github/workflows/mvp-verification.yml`
- `packages/db/package.json`
- `docs/AI_WORK_STATE.md`

## 未完了

- run #8 の詳細失敗ステップ確認
- typecheck failure の詳細ログ確認
- typecheck failure の修正
- lockfile生成と依存バージョン固定の最終確認
- API実起動
- Web実起動
- 実HTTP smoke
- ブラウザ確認
- スマホ幅確認
- 認証プロバイダ確定
- 決済プロバイダ詳細設定
- 既存問題データの全件投入形式確認
- 既存問題データの品質確認
- 進捗保存APIの実装
- 見直し・復習APIの実装
- 課金権限APIの実装
- 管理画面の最小実装

## 保留

- GitHub Actions run #8 の job steps / logs を確認する
- run #8 が引き続き `Typecheck` failure の場合、型エラー本文を確認して修正する
- workflow内の `pnpm db:migrate` は今回run #7で成功したが、正式なmigrationファイル運用は別途確認する
- lockfile生成後に依存バージョンと `packageManager` 固定の整合を確認する
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

- pnpm install: ローカル未実行 / Actionsではrun #6以降成功
- lockfile生成: ローカル未実行
- DB起動: ローカル未実行 / Actions PostgreSQL serviceは起動
- Prisma generate: ローカル未実行 / Actions run #7で成功
- Prisma migrate: ローカル未実行 / Actions run #7で成功
- seed実行: ローカル未実行 / Actions run #7で成功
- API起動: 未実行
- Web起動: 未実行
- 実HTTP smoke: 未実行
- ブラウザ確認: 未実行
- スマホ幅確認: 未実行
- GitHub Actions workflow: run #8 completed / failure、詳細失敗ステップ未確定

## 次回作業

1. `feat/mvp-foundation-v2` / PR #1 を起点にする
2. GitHub Actions `MVP verification` の最新runを確認する
3. 最新runの job steps / logs を確認する
4. `Typecheck` failure の場合は型エラー本文を確認して修正する
5. typecheckが通った場合は build / API-Web起動 / smoke の次の失敗箇所を確認する
6. lockfile生成後に依存バージョンと `packageManager` の固定方針を確認する
7. ネットワーク利用可能なローカル環境でも `pnpm install` を実行し、lockfileを生成する
8. Docker PostgreSQLを起動する
9. Prisma generate / migrate / seed を実行する
10. APIを起動し、主要エンドポイントを実HTTP確認する
11. Webを起動し、PC幅・スマホ幅で確認する
12. `bash tools/license_base_smoke.sh` を実行する
13. FE Practice Labトップ、演習画面、回答選択、採点結果表示をブラウザ確認する
14. テキスト限定問題のvisualHtml非表示取込ルートを設計する

## 推定完成度

- 企画・要件: 49%
- アーキテクチャ: 44%
- DB設計: 44%
- UI方針: 37%
- 実装: 39%
- 検証: 12%
- 引継ぎ整備: 95%

## 次回用短縮プロンプト

Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。`feat/mvp-foundation-v2` / PR #1 を起点に、License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを進めてください。前回、root `package.json` の `packageManager` を `pnpm@10.0.0` に固定し、`.github/workflows/mvp-verification.yml` の `PNPM_VERSION` も `10.0.0` に揃えました。また `packages/db/package.json` で `@prisma/client` / `prisma` を `5.22.0` に固定し、`@types/node` を追加しました。Actionsでは run #7 で install、Prisma generate、migrate、seed まで成功し、`Typecheck` で failure になりました。最新runは run #8 completed / failure まで確認済みですが詳細step再取得は未完了です。まず最新runの job steps / logs を確認し、typecheck failure の型エラーを修正してください。この実行環境では外部DNS不可、pnpm未導入、Docker未導入のため、ローカルの pnpm install、lockfile生成、DB起動、Prisma generate / migrate / seed、API/Web起動、実HTTP smoke、PC幅・スマホ幅確認は未実行です。未実行チェックは成功扱いせず、最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプトを出してください。
