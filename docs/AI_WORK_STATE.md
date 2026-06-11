# AI_WORK_STATE

## 現在状態

License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを継続中。`feat/mvp-foundation-v2` / PR #1 を起点に、GitHub Actions `MVP verification` の失敗箇所を段階的に切り分け、Actions上では `pnpm-lock.yaml` 追加後の frozen lockfile 検証まで成功する状態に到達した。この実行環境では外部DNS、pnpm、Dockerの制約が継続しているため、ローカル実行検証は未実行のまま成功扱いしない。

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
- この実行環境を再確認
  - Node/Corepack は利用可能
  - `pnpm` は未導入
  - Docker は未導入
  - `github.com` / `registry.npmjs.org` の名前解決は不可
- PR #1 の `open` / `draft` / `mergeable: true` を再確認
- `pnpm-lock.yaml` が未配置であることを確認
- `.github/workflows/mvp-verification.yml` を一時更新
  - `generated-pnpm-lockfile` artifact を追加
  - Actions上で生成された `pnpm-lock.yaml` を取得可能にした
- GitHub Actions `MVP verification` run #17 を確認
  - completed / success
  - `generated-pnpm-lockfile` artifact のアップロードは success
  - static-check / integration は success
  - PostgreSQL service、Prisma migrate、seed、API/Web起動、API待機、Web待機、HTTP smoke は success
- `generated-pnpm-lockfile` artifact を確認
  - `pnpm-lock.yaml` を含むZIPとして取得可能
  - artifact内lockfileは 118,331 bytes / SHA-256 `2ce6f4c7f5f40f1833e2992ba014a61421e75649acfc96031cd365fc6ddce779`
- `.github/workflows/mvp-verification.yml` を一時更新
  - PR head branchをcheckoutする設定へ変更
  - `contents: write` を一時付与
  - `Commit generated pnpm lockfile` step を追加
- GitHub Actions `MVP verification` run #18 を確認
  - `Commit generated pnpm lockfile` は success
  - `pnpm-lock.yaml` が PR branch に追加されたことを確認
- `.github/workflows/mvp-verification.yml` を通常検証用へ戻した
  - `contents: read` へ戻した
  - lockfile artifact / self-commit step を削除
  - `pnpm install --frozen-lockfile` へ変更
- GitHub Actions `MVP verification` run #19 を確認
  - completed / success
  - frozen lockfile状態で `Install dependencies` は success
  - `Generate Prisma client` / `Typecheck` / `Build` は success
  - integrationの PostgreSQL service / Prisma migrate / seed / API-Web起動 / API-Web待機 / HTTP smoke は success

## 変更ファイル

- `.github/workflows/mvp-verification.yml`
- `pnpm-lock.yaml`
- `docs/AI_WORK_STATE.md`

## 未完了

- ローカルでの `pnpm install`
- ローカルDB起動
- ローカルPrisma generate / migrate / seed
- ローカルAPI実起動
- ローカルWeb実起動
- ローカル実HTTP smoke
- PC幅ブラウザ確認
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

- Actionsでは `MVP verification` run #19 が frozen lockfile状態で成功したが、ローカル検証は未実行
- `pnpm-lock.yaml` はActions生成物をPR branchへ反映済みだが、ローカルでの `pnpm install --frozen-lockfile` は未実行
- workflow内の `pnpm db:migrate` はActions run #19で成功したが、正式なmigrationファイル運用は別途確認する
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

- pnpm install: ローカル未実行 / Actionsではrun #19で `--frozen-lockfile` 成功
- lockfile生成: ローカル未実行 / Actions生成物を `pnpm-lock.yaml` としてPR branchへ反映済み
- DB起動: ローカル未実行 / Actions PostgreSQL serviceはrun #19成功
- Prisma generate: ローカル未実行 / Actions run #19成功
- Prisma migrate: ローカル未実行 / Actions run #19成功
- seed実行: ローカル未実行 / Actions run #19成功
- API起動: ローカル未実行 / Actions run #19成功
- Web起動: ローカル未実行 / Actions run #19成功
- 実HTTP smoke: ローカル未実行 / Actions run #19成功
- ブラウザ確認: 未実行
- スマホ幅確認: 未実行
- GitHub Actions workflow: run #19 completed / success

## 次回作業

1. `feat/mvp-foundation-v2` / PR #1 を起点にする
2. PR #1 の最新headとActions最新runを確認する
3. ネットワーク利用可能なローカル環境で `pnpm install --frozen-lockfile` を実行する
4. Docker PostgreSQLを起動する
5. Prisma generate / migrate / seed をローカル実行する
6. APIを起動し、主要エンドポイントを実HTTP確認する
7. Webを起動し、PC幅・スマホ幅で確認する
8. `bash tools/license_base_smoke.sh` をローカル実行する
9. FE Practice Labトップ、演習画面、回答選択、採点結果表示をブラウザ確認する
10. テキスト限定問題のvisualHtml非表示取込ルートを設計する
11. 進捗保存API、見直し・復習API、課金権限APIの実装へ進む

## 推定完成度

- 企画・要件: 49%
- アーキテクチャ: 45%
- DB設計: 46%
- UI方針: 37%
- 実装: 42%
- 検証: 42%
- 引継ぎ整備: 98%

## 次回用短縮プロンプト

Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。`feat/mvp-foundation-v2` / PR #1 を起点に、License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを進めてください。前回、Actionsで生成した `pnpm-lock.yaml` をPR branchへ反映し、`.github/workflows/mvp-verification.yml` を `pnpm install --frozen-lockfile` 検証へ戻しました。GitHub Actions `MVP verification` run #19 は completed / success で、frozen lockfile状態の install、static-check、build、PostgreSQL service、Prisma migrate、seed、API/Web起動、API/Web待機、HTTP smoke まで成功済みです。ただし、この実行環境では外部DNS不可、pnpm未導入、Docker未導入のため、ローカルの pnpm install、DB起動、Prisma generate / migrate / seed、API/Web起動、実HTTP smoke、PC幅・スマホ幅確認は未実行です。未実行チェックは成功扱いせず、次はネットワーク利用可能なローカル環境で `pnpm install --frozen-lockfile` とローカル実行検証を進めてください。最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプトを出してください。
