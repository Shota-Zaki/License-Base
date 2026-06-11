# AI_WORK_STATE

## 現在状態

License Base / Engineer-License-Lab / FE Practice Lab の新規Web MVPを開始。`Shota-Zaki/License-Base` のmainへ初期スターターを反映済み。プロジェクトコンテキスト、情報源優先順位、チャット引継ぎルールも整備済み。

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

## 最初に読むファイル

1. `CHATGPT_READ_FIRST.md`
2. `docs/AI_WORK_STATE.md`
3. `docs/chatgpt/PROJECT_CONTEXT.md`
4. `docs/chatgpt/SOURCE_OF_TRUTH.md`
5. `docs/chatgpt/HANDOFF_RULES.md`
6. `docs/WORKING_RULES.md`

## 今回作成・更新したもの

- `CHATGPT_READ_FIRST.md`
- `docs/chatgpt/PROJECT_CONTEXT.md`
- `docs/chatgpt/SOURCE_OF_TRUTH.md`
- `docs/chatgpt/HANDOFF_RULES.md`
- `docs/chatgpt/WORKFLOW.md`
- `docs/WORKING_RULES.md`
- `README.md`
- ルート設定ファイル
- docs配下の設計・運用文書
- Next.js Web skeleton
- NestJS API skeleton
- Prisma schema draft
- seed draft
- 共通パッケージ雛形

## 未完了

- 依存関係インストール
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
- 既存問題データの投入形式確認
- Prisma schemaの本番前精査
- lockfile生成と依存バージョン固定
- `docs/chatgpt/` 配下の内容と実装進捗の継続同期

## 保留

- UIの最終ビジュアル詳細
- Free / Basic の価格
- 無料公開する問題数
- 既存問題データの品質確認
- 管理者権限の詳細
- 本番ホスティング先

## 次回作業

1. `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を読んで開始する
2. Prisma schemaを実DB向けに精査する
3. 依存関係をインストールできる状態へ調整する
4. DB起動・Prisma generate・migrate・seedを確認する
5. APIのpublic course/question endpointをDB接続に差し替える
6. WebのFE Practice Labトップを実装強化する
7. 問題一覧と問題演習画面を実装する

## 推定完成度

- 企画・要件: 40%
- アーキテクチャ: 30%
- DB設計: 25%
- UI方針: 25%
- 実装: 8%
- 検証: 0%
- 引継ぎ整備: 70%

## 次回用短縮プロンプト

Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを、AI_WORK_STATE.mdの次回作業・未完了・保留を起点に進めてください。プロジェクトコンテキストは `docs/chatgpt/PROJECT_CONTEXT.md`、情報源の優先順位は `docs/chatgpt/SOURCE_OF_TRUTH.md`、引継ぎルールは `docs/chatgpt/HANDOFF_RULES.md` を正としてください。確認質問なしで可能な範囲を一括で進め、未実行チェックは成功扱いせず、最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプトを出してください。
