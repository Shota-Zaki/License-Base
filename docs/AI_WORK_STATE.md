# AI_WORK_STATE

## 現在状態

License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを継続中。`feat/mvp-foundation-v2` / PR #1 を起点に、GitHub Actions `MVP verification` の失敗確認とworkflow修正を実施した。この実行環境では外部DNS、pnpm、Dockerの制約が継続しているため、ローカル実行検証は未実行のまま成功扱いしない。Actions上では前回 `Enable pnpm` で失敗していたため、Corepack経由をやめ、`npm install -g pnpm@latest` でpnpmを導入する形へ変更した。新しいrun #3は起動後 completed / failure になったが、今回時点では詳細ステップの最終切り分けは未完了。

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
- GitHub Actions `MVP verification` run #2 の結果を確認
  - completed / failure
  - verify job の `Enable pnpm` ステップで failure
  - `Install dependencies` 以降は skipped
- `.github/workflows/mvp-verification.yml` を修正
  - `Enable pnpm` ステップを廃止
  - `Install pnpm` ステップへ変更
  - `npm install -g pnpm@latest` と `pnpm --version` でpnpmを導入する形へ変更
- 修正後のPR headでGitHub Actions `MVP verification` run #3 が起動したことを確認
- run #3 は completed / failure まで確認
- run #3 の詳細失敗ステップ確認は次回継続

## 変更ファイル

- `.github/workflows/mvp-verification.yml`
- `docs/AI_WORK_STATE.md`

## 未完了

- run #3 の詳細失敗ステップ確認
- 依存関係インストール
- lockfile生成と依存バージョン固定
- DB起動
- Prisma generate
- Prisma migrate
- seed実行
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

- GitHub Actions run #3 の job steps / logs を確認する
- run #3 が `Install dependencies` 以降で失敗している場合、該当ログをもとに修正する
- workflow内の `pnpm db:migrate` は、migrationファイル未整備の場合に失敗する可能性がある
- lockfile生成後に `packageManager` のexact version固定要否を確認する
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

- pnpm install: 未実行
- lockfile生成: 未実行
- DB起動: 未実行
- Prisma generate: 未実行
- Prisma migrate: 未実行
- seed実行: 未実行
- API起動: 未実行
- Web起動: 未実行
- 実HTTP smoke: 未実行
- ブラウザ確認: 未実行
- スマホ幅確認: 未実行
- GitHub Actions workflow: run #3 completed / failure、詳細失敗ステップ未確定

## 次回作業

1. `feat/mvp-foundation-v2` / PR #1 を起点にする
2. GitHub Actions `MVP verification` run #3 の job steps / logs を確認する
3. 失敗ステップが `Install dependencies` の場合は依存・workspace・packageManager周りを修正する
4. 失敗ステップが Prisma の場合は migrationファイル有無を確認し、必要に応じてCI用のschema適用方式を検討する
5. 失敗ステップが typecheck / build の場合は型・Next/Nest設定を修正する
6. 失敗ステップが API/Web起動またはsmokeの場合はログから環境変数・port・endpointを修正する
7. ネットワーク利用可能なローカル環境でも `pnpm install` を実行し、lockfileを生成する
8. lockfile生成後に依存バージョンと `packageManager` の固定方針を確認する
9. Docker PostgreSQLを起動する
10. Prisma generate / migrate / seed を実行する
11. APIを起動し、主要エンドポイントを実HTTP確認する
12. Webを起動し、PC幅・スマホ幅で確認する
13. `bash tools/license_base_smoke.sh` を実行する
14. FE Practice Labトップ、演習画面、回答選択、採点結果表示をブラウザ確認する
15. テキスト限定問題のvisualHtml非表示取込ルートを設計する

## 推定完成度

- 企画・要件: 49%
- アーキテクチャ: 44%
- DB設計: 42%
- UI方針: 37%
- 実装: 38%
- 検証: 5%
- 引継ぎ整備: 94%

## 次回用短縮プロンプト

Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。`feat/mvp-foundation-v2` / PR #1 を起点に、License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを進めてください。前回、`.github/workflows/mvp-verification.yml` のpnpm導入を Corepack 経由から `npm install -g pnpm@latest` 方式へ変更しました。修正後の GitHub Actions `MVP verification` run #3 は起動後 completed / failure まで確認済みですが、詳細失敗ステップの切り分けは未完了です。まず run #3 の job steps / logs を確認し、失敗箇所に応じて workflow / 依存 / Prisma / typecheck / build / API-Web起動 / smoke を修正してください。この実行環境では外部DNS不可、pnpm未導入、Docker未導入のため、ローカルの pnpm install、lockfile生成、DB起動、Prisma generate / migrate / seed、API/Web起動、実HTTP smoke、PC幅・スマホ幅確認は未実行です。未実行チェックは成功扱いせず、最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプトを出してください。
