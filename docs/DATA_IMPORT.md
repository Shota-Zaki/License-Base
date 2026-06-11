# DATA_IMPORT

## 対象データ

今回の添付ZIPは、EEL問題・演習・基礎解説データをアプリ投入向けに分離した runtime import bundle として扱う。

## 主要フィード

| フィード | 件数 | MVPでの扱い |
|---|---:|---|
| FE公式確認済み | 884 | FE Practice Labへ投入候補 |
| FEテキスト限定 | 1,032 | visualHtmlを表示せず投入候補 |
| FE AI生成 | 200 | 公式問題と分離しレビュー待ち |
| FE正答なし | 286 | 採点不能のため出題不可 |
| DB/SQL | 3,198 | 将来のDB/SQL Practice Lab投入候補 |
| Java | 3,750 | 将来のJava Practice Lab投入候補 |

## MVP seedでの採用

初期MVP seedでは、FE公式確認済みフィードから5問だけを `packages/db/prisma/seed-data/fe-mvp-questions.json` に抽出して使用する。

- 対象: `READY_OFFICIAL`
- 出典: IPA公開問題
- 解説: 既存EEL側で新規作成済みの解説
- visualHtml: seedには含めない
- 正答なしデータ: 含めない
- AI生成分離データ: 含めない

## importルール

1. `EXCLUDE_NO_ANSWER` は採点対象に入れない。
2. `AI_GENERATED_SEPARATE` は公式問題一覧に混ぜない。
3. `TEXT_ONLY_VISUAL_PENDING` は `visualHtml` を表示しない。
4. ランダム演習では、同一 `duplicateGroupId` の重複出題を避ける。
5. 公式問題は出典表示欄をUIに用意する。

## 未実施

- 公式PDFとの本文・選択肢・正答再照合
- 全問の解説内容目視監査
- 実DB import
- PC幅・スマホ幅表示確認
