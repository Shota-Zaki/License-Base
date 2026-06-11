# AI_WORK_STATE

## 現在状態

License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを継続中。`feat/mvp-foundation-v2` / PR #1 を起点に、PR mergeable状態を再確認し、実行検証を再試行した。実行環境制約は継続しているため、未実行チェックは成功扱いせず、回答選択UIを `POST /v1/practice-sets/:id/grade` へ接続した。

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
- 実行環境を再確認し、`github.com` / `registry.npmjs.org` のDNS不可、pnpm未導入、Docker未導入を再確認
- Web API helperに `gradePracticeSet()` と採点結果型を追加
- `PracticeSetClient` を追加し、回答選択、提出、採点結果、解説表示、再挑戦を接続
- 演習ページをサーバー取得 + クライアント回答UI構成へ変更
- 採点状態用CSSを追加
- `docs/AI_WORK_STATE.md` を更新

## 変更ファイル

- `apps/web/lib/api.ts`
- `apps/web/app/engineer-license-lab/fe/practice/[practiceSetId]/PracticeSetClient.tsx`
- `apps/web/app/engineer-license-lab/fe/practice/[practiceSetId]/page.tsx`
- `apps/web/app/globals.css`
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
8. FE Practice Labトップ、演習画面、回答選択、採点結果表示をブラウザ確認する
9. FEテキスト限定問題のvisualHtml非表示取込ルートを設計する

## 推定完成度

- 企画・要件: 48%
- アーキテクチャ: 43%
- DB設計: 42%
- UI方針: 37%
- 実装: 34%
- 検証: 0%
- 引継ぎ整備: 88%

## 次回用短縮プロンプト

Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。`feat/mvp-foundation-v2` / PR #1 を起点に、License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを進めてください。前回、回答選択UIを `POST /v1/practice-sets/:id/grade` へ接続し、選択、提出、採点結果、解説表示、再挑戦まで実装済みです。ただし、この実行環境では `github.com` / `registry.npmjs.org` の名前解決に失敗し、pnpm未導入・Docker未導入のため、pnpm install、lockfile生成、DB起動、Prisma generate / migrate / seed、API/Web起動、実HTTP smoke、PC幅・スマホ幅確認は未実行です。ネットワークとDockerが使える環境で実行検証を優先してください。未実行チェックは成功扱いせず、最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプトを出してください。
