# WORKING_RULES

## 基本方針

- 作業開始時は `CHATGPT_READ_FIRST.md` を最初に確認する。
- 次に `docs/AI_WORK_STATE.md` を確認する。
- プロジェクトコンテキストは `docs/chatgpt/PROJECT_CONTEXT.md` を正とする。
- 情報源の優先順位は `docs/chatgpt/SOURCE_OF_TRUTH.md` を正とする。
- チャット引継ぎは `docs/chatgpt/HANDOFF_RULES.md` に従う。
- 過去の別プロジェクト成果物は前提にしない。
- License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを起点にする。
- 可能な作業は確認質問なしで進める。
- 危険・不可逆・仕様確定が必要な判断のみ保留する。

## 作業記録

毎回、以下を残す。

- 完了した作業
- 変更ファイル
- 未実行チェック
- 保留
- 残作業
- 推定完成度
- 次回用短縮プロンプト

## 検証ルール

未実行の検証を成功扱いしない。

未実行の場合は、以下のように明記する。

- pnpm install: 未実行
- Prisma generate: 未実行
- Prisma migrate: 未実行
- seed実行: 未実行
- API起動: 未実行
- Web起動: 未実行
- 実HTTP smoke: 未実行
- ブラウザ確認: 未実行
- スマホ幅確認: 未実行

## UIルール

UI作業前に `docs/DESIGN.md` を確認・必要に応じて更新する。

設計文書、コード、CSSクラス名、コメント、README、差分ログには、参考元の固有名詞・ブランド名・キャラクター名・ロゴ名を入れない。

## コンテンツルール

- 公式情報とオリジナル問題・解説を中心にする。
- 第三者サイトの本文・解説コピーは避ける。
- 公式確認状態を根拠なしに上げない。
- 不明なものは `needs_review` または `unverified` として管理する。

## GitHub運用

- mainへ直接反映する場合は、初期スターター・ドキュメント整備・軽微な修正に限定する。
- 大きな実装はfeature branchまたはPR単位に分ける。
- 依存関係更新後はlockfileを確認する。

## チャット変更時

新しいチャットでは、以下を渡す。

```txt
Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。
License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを、AI_WORK_STATE.mdの次回作業・未完了・保留を起点に進めてください。
プロジェクトコンテキストは `docs/chatgpt/PROJECT_CONTEXT.md`、情報源の優先順位は `docs/chatgpt/SOURCE_OF_TRUTH.md`、引継ぎルールは `docs/chatgpt/HANDOFF_RULES.md` を正としてください。
確認質問なしで可能な範囲を一括で進め、未実行チェックは成功扱いせず、最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプトを出してください。
```
