# AI_WORK_STATE

## 現在状態

License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを継続中。`feat/mvp-foundation-v2` / PR #1 を起点に、PR状態を再確認し、実行検証を再試行した。実行環境制約は継続しているため、未実行チェックは成功扱いせず、ネットワークとDockerが使える環境向けにsmokeスクリプトとローカル検証手順を追加強化した。

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
- `docs/chatgpt/PROJECT_CONTEXT.md` / `docs/chatgpt/SOURCE_OF_TRUTH.md` / `docs/chatgpt/HANDOFF_RULES.md` / `docs/WORKING_RULES.md` / `docs/DESIGN.md` を確認
- PR #1 の `open` / `draft` / `mergeable: true` を再確認
- 実行環境を再確認し、外部DNS不可、pnpm未導入、Docker未導入を再確認
- `tools/license_base_smoke.sh` を強化
  - `curl` / `node` の事前確認を追加
  - 一時ディレクトリを安全に作成・削除する形へ変更
  - API / WebのベースURLを明示出力
  - レスポンス出力を先頭1200文字に制限
  - 演習取得レスポンスの問題ID・選択肢IDを検査
  - 提出前レスポンスに正誤・正答・解説用フィールドが漏れていないことを検査
  - 採点レスポンスの件数・正答数・スコア・正答選択肢・解説を検査
- `docs/LOCAL_VERIFICATION.md` を更新
  - 事前確認手順を追加
  - DBコンテナ状態確認を追加
  - smokeスクリプトの機械判定対象を明記
  - 成功扱い条件にsmoke完走を追加
- PR #1 本文を最新の要約と未実行チェックへ更新

## 変更ファイル

- `tools/license_base_smoke.sh`
- `docs/LOCAL_VERIFICATION.md`
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
- 認証プロバイダ確定
- 決済プロバイダ詳細設定
- 既存問題データの全件投入形式確認
- 既存問題データの品質確認
- 進捗保存APIの実装
- 見直し・復習APIの実装
- 課金権限APIの実装
- 管理画面の最小実装

## 保留

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
- lockfile生成後に `packageManager` のexact version固定要否を確認する

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

## 次回作業

1. `feat/mvp-foundation-v2` / PR #1 を起点にする
2. ネットワーク利用可能な環境で `pnpm install` を実行し、lockfileを生成する
3. lockfile生成後に依存バージョンと `packageManager` の固定方針を確認する
4. Docker PostgreSQLを起動する
5. Prisma generate / migrate / seed を実行する
6. seed-data読込とPrisma schema/API型の不整合を修正する
7. APIを起動し、主要エンドポイントを実HTTP確認する
8. Webを起動し、PC幅・スマホ幅で確認する
9. `bash tools/license_base_smoke.sh` を実行する
10. FE Practice Labトップ、演習画面、回答選択、採点結果表示をブラウザ確認する
11. テキスト限定問題のvisualHtml非表示取込ルートを設計する

## 推定完成度

- 企画・要件: 49%
- アーキテクチャ: 43%
- DB設計: 42%
- UI方針: 37%
- 実装: 36%
- 検証: 0%
- 引継ぎ整備: 92%

## 次回用短縮プロンプト

Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。`feat/mvp-foundation-v2` / PR #1 を起点に、License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを進めてください。前回、`tools/license_base_smoke.sh` を強化し、提出前の正誤・正答・解説漏れ検査、採点レスポンスの件数・正答数・スコア・正答選択肢・解説検査を追加しました。`docs/LOCAL_VERIFICATION.md` も事前確認とsmoke判定対象に合わせて更新済みです。PR #1 は `open` / `draft` / `mergeable: true` です。ただし、この実行環境では外部DNS不可、pnpm未導入、Docker未導入のため、pnpm install、lockfile生成、DB起動、Prisma generate / migrate / seed、API/Web起動、実HTTP smoke、PC幅・スマホ幅確認は未実行です。ネットワークとDockerが使える環境で実行検証を優先してください。未実行チェックは成功扱いせず、最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプトを出してください。
