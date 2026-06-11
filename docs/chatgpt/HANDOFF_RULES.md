# HANDOFF_RULES

## 目的

チャットを変えるとき、作業者が変わるとき、または長い作業を区切るときに、状態を安全に引き継ぐためのルールを定義する。

## 新しいチャットで最初に読むもの

必ず以下の順に読む。

1. `CHATGPT_READ_FIRST.md`
2. `docs/AI_WORK_STATE.md`
3. `docs/chatgpt/PROJECT_CONTEXT.md`
4. `docs/chatgpt/SOURCE_OF_TRUTH.md`
5. `docs/chatgpt/HANDOFF_RULES.md`
6. `docs/WORKING_RULES.md`

## チャット変更時に渡す短縮プロンプト

```txt
Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。
License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを、AI_WORK_STATE.mdの次回作業・未完了・保留を起点に進めてください。
プロジェクトコンテキストは `docs/chatgpt/PROJECT_CONTEXT.md`、情報源の優先順位は `docs/chatgpt/SOURCE_OF_TRUTH.md`、引継ぎルールは `docs/chatgpt/HANDOFF_RULES.md` を正としてください。
確認質問なしで可能な範囲を一括で進め、未実行チェックは成功扱いせず、最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプトを出してください。
```

## 作業完了時の引継ぎテンプレート

```md
## 完了した作業

- 

## 変更ファイル

- 

## 未実行チェック

- pnpm install: 未実行 / 実行済み
- DB起動: 未実行 / 実行済み
- Prisma generate: 未実行 / 実行済み
- Prisma migrate: 未実行 / 実行済み
- seed実行: 未実行 / 実行済み
- API起動: 未実行 / 実行済み
- Web起動: 未実行 / 実行済み
- 実HTTP smoke: 未実行 / 実行済み
- ブラウザ確認: 未実行 / 実行済み
- スマホ幅確認: 未実行 / 実行済み

## 保留

- 

## 次にやること

1. 
2. 
3. 

## 推定完成度

- 企画・要件: 
- アーキテクチャ: 
- DB設計: 
- UI方針: 
- 実装: 
- 検証: 
```

## 引継ぎで禁止すること

- 未実行チェックを成功扱いすること。
- 推定を事実として扱うこと。
- 公式確認していないコンテンツを公式確認済みにすること。
- 過去の別プロジェクトを前提にすること。
- 参考元の固有名詞を設計文書・コード・README・差分ログに残すこと。

## 長い作業の区切り方

大きな作業は以下に分ける。

1. 設計更新
2. DB schema更新
3. API実装
4. Web実装
5. 管理画面実装
6. 認証・課金実装
7. 検証
8. AI_WORK_STATE更新

各区切りで、必ず未実行チェックと保留を残す。
