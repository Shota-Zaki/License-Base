# AI_WORK_STATE

## 現在状態

License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを継続中。`feat/mvp-foundation-v2` / PR #1 を起点に、PR状態と実行環境を再確認した。この実行環境では外部DNS、pnpm、Dockerの制約が継続しているため、未実行チェックは成功扱いしない。代替として、ネットワークとPostgreSQLサービスを使えるGitHub Actions上でMVP検証を走らせるworkflowを追加した。

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
- 実行環境を再確認
  - Node / Corepack は存在
  - pnpm は未導入
  - Docker は未導入
  - `github.com` / `registry.npmjs.org` の名前解決は不可
- PR headに紐づくGitHub Actions workflow runがまだ無いことを確認
- `.github/workflows/mvp-verification.yml` を追加
  - PostgreSQL 16サービスを起動
  - Corepackでpnpmを有効化
  - `pnpm install --no-frozen-lockfile`
  - Prisma client生成
  - Prisma migrate
  - seed実行
  - typecheck
  - build
  - API / Web起動
  - API / Webの起動待機
  - `bash tools/license_base_smoke.sh`
  - 失敗時にAPI/Webログを出力

## 変更ファイル

- `.github/workflows/mvp-verification.yml`
- `docs/AI_WORK_STATE.md`

## 未完了

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
- GitHub Actions workflowの実行結果確認
- 認証プロバイダ確定
- 決済プロバイダ詳細設定
- 既存問題データの全件投入形式確認
- 既存問題データの品質確認
- 進捗保存APIの実装
- 見直し・復習APIの実装
- 課金権限APIの実装
- 管理画面の最小実装

## 保留

- GitHub Actions が有効な場合、次回 workflow run の結果を確認する
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
- GitHub Actions workflow: 追加済み / 実行結果未確認

## 次回作業

1. `feat/mvp-foundation-v2` / PR #1 を起点にする
2. GitHub Actions の `MVP verification` workflow run有無と結果を確認する
3. workflowが失敗している場合はログから依存、Prisma、seed、typecheck、build、API/Web起動、smokeのどこで止まったか切り分ける
4. ネットワーク利用可能なローカル環境でも `pnpm install` を実行し、lockfileを生成する
5. lockfile生成後に依存バージョンと `packageManager` の固定方針を確認する
6. Docker PostgreSQLを起動する
7. Prisma generate / migrate / seed を実行する
8. APIを起動し、主要エンドポイントを実HTTP確認する
9. Webを起動し、PC幅・スマホ幅で確認する
10. `bash tools/license_base_smoke.sh` を実行する
11. FE Practice Labトップ、演習画面、回答選択、採点結果表示をブラウザ確認する
12. テキスト限定問題のvisualHtml非表示取込ルートを設計する

## 推定完成度

- 企画・要件: 49%
- アーキテクチャ: 44%
- DB設計: 42%
- UI方針: 37%
- 実装: 37%
- 検証: 0%
- 引継ぎ整備: 93%

## 次回用短縮プロンプト

Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。`feat/mvp-foundation-v2` / PR #1 を起点に、License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを進めてください。前回、`.github/workflows/mvp-verification.yml` を追加し、GitHub Actions上で PostgreSQLサービス、pnpm install、Prisma generate / migrate / seed、typecheck、build、API/Web起動、`bash tools/license_base_smoke.sh` まで流す検証workflowを用意しました。ただし、この実行環境では外部DNS不可、pnpm未導入、Docker未導入のため、ローカルの pnpm install、lockfile生成、DB起動、Prisma generate / migrate / seed、API/Web起動、実HTTP smoke、PC幅・スマホ幅確認は未実行です。GitHub Actions workflow runの結果確認と、ネットワーク/Dockerが使える環境での実行検証を優先してください。未実行チェックは成功扱いせず、最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプトを出してください。
