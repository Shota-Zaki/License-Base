# CHATGPT_READ_FIRST

## 目的

このファイルは、License Baseプロジェクトで新しいチャット・新しい作業者・AI支援ツールが作業を始める前に、最初に読む入口です。

## 最初に読む順番

1. `CHATGPT_READ_FIRST.md`
2. `docs/AI_WORK_STATE.md`
3. `docs/chatgpt/PROJECT_CONTEXT.md`
4. `docs/chatgpt/SOURCE_OF_TRUTH.md`
5. `docs/chatgpt/HANDOFF_RULES.md`
6. `docs/WORKING_RULES.md`
7. 作業対象に応じた設計文書
   - `docs/MVP_REQUIREMENTS.md`
   - `docs/ARCHITECTURE.md`
   - `docs/DB_SCHEMA.md`
   - `docs/API.md`
   - `docs/DESIGN.md`
   - `docs/CONTENT_POLICY.md`

## 現在のプロジェクト概要

License Baseは資格学習全般の上位ブランド。最初のMVPはEngineer-License-Lab配下のFE Practice Lab。

初期方針は以下。

- Web MVPから開始
- PWAは次段階
- Expoアプリは将来対応
- 初期対象はFE Practice Lab
- 公式情報 + オリジナル問題・解説
- 課金土台はMVPから入れる
- ゲスト閲覧可
- 進捗保存はログイン必須
- App Store / Google Play公開は初期対象外

## 作業原則

- 可能な範囲は確認質問なしで進める。
- 危険・不可逆・仕様確定が必要な判断は保留にする。
- 未実行チェックを成功扱いしない。
- UI作業前に`docs/DESIGN.md`を確認する。
- コンテンツ作業では`docs/CONTENT_POLICY.md`を確認する。
- 作業後は`docs/AI_WORK_STATE.md`を更新する。

## 禁止事項

- 過去の別プロジェクト成果物を前提にしない。
- 根拠なしに公式確認済みへ変更しない。
- 第三者サイトの本文・解説コピーを入れない。
- 未実行の検証を成功扱いしない。
- 参考元の固有名詞・ブランド名・キャラクター名・ロゴ名を設計文書、コード、CSSクラス名、コメント、README、差分ログに入れない。

## 作業完了時に必ず残すもの

- 完了した作業
- 変更ファイル
- 未実行チェック
- 保留
- 進捗サマリー
- 残作業一覧
- 推定完成度
- 次回用短縮プロンプト
