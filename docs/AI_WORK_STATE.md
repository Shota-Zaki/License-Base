# AI_WORK_STATE

## 現在状態

License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを継続中。`feat/mvp-foundation-v2` / PR #1 を起点に、PR mergeable状態を再確認し、添付EEL runtime import bundle由来のMVP seed候補を図表なしでも表示できる公式確認済み5問へ差し替えた。

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
- PR #1 の `mergeable: true` を確認
- `packages/db/prisma/seed-data/fe-mvp-questions.json` を図表なしでも表示できる公式確認済み5問へ差し替え
- ローカル実行環境を再確認
- `docs/AI_WORK_STATE.md` を更新

## 変更ファイル

- `packages/db/prisma/seed-data/fe-mvp-questions.json`
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
- `.env.example` ではなく `env.example` として追加済み
- 問題詳細・演習詳細で正答情報を返しているため、提出前非公開仕様への分離が必要
- FEテキスト限定1032問はvisualHtml非表示ルート実装後に投入
- FE正答なし286問は出題不可
- FE AI生成200問は公式問題と分離しレビュー待ち
- この実行環境では `github.com` と npm registry の名前解決に失敗
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

## 次回作業

1. `feat/mvp-foundation-v2` / PR #1 を起点にする
2. ネットワーク利用可能な環境で `pnpm install` を実行し、lockfileを生成する
3. Docker PostgreSQLを起動する
4. Prisma generate / migrate / seed を実行する
5. seed-data読込とPrisma schema/API型の不整合を修正する
6. APIを起動し、主要エンドポイントを実HTTP確認する
7. Webを起動し、PC幅・スマホ幅で確認する
8. 正答公開仕様を提出後表示へ分離する
9. FEテキスト限定問題のvisualHtml非表示取込ルートを設計する

## 推定完成度

- 企画・要件: 47%
- アーキテクチャ: 42%
- DB設計: 42%
- UI方針: 35%
- 実装: 28%
- 検証: 0%
- 引継ぎ整備: 86%

## 次回用短縮プロンプト

Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。`feat/mvp-foundation-v2` / PR #1 を起点に、License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを進めてください。前回、PR #1 の `mergeable: true` を確認し、`packages/db/prisma/seed-data/fe-mvp-questions.json` を図表なしでも表示できる公式確認済み5問へ差し替え済みです。ただし、この実行環境では `github.com` / `registry.npmjs.org` の名前解決に失敗し、pnpm未導入・Docker未導入のため、pnpm install、lockfile生成、DB起動、Prisma generate / migrate / seed、API/Web起動、実HTTP smoke、PC幅・スマホ幅確認は未実行です。ネットワークとDockerが使える環境で実行検証を優先してください。未実行チェックは成功扱いせず、最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプトを出してください。
