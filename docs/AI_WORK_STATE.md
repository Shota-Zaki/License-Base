# AI_WORK_STATE

## 現在状態

License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを継続中。`feat/mvp-foundation-v2` / PR #1 を起点に、GitHub Actions `MVP verification` の失敗箇所を段階的に切り分け、Actions上では `static-check` と `integration` が成功する状態まで到達した。この実行環境では外部DNS、pnpm、Dockerの制約が継続しているため、ローカル実行検証は未実行のまま成功扱いしない。

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
- GitHub Actions `MVP verification` run #9 を確認
  - completed / failure
  - `Install dependencies` は success
  - `Generate Prisma client` は success
  - `Run Prisma migration` は success
  - `Seed database` は success
  - `Typecheck` は failure
- `.github/workflows/mvp-verification.yml` を更新
  - `static-check` job と `integration` job に分割
  - `static-check` で install / Prisma generate / typecheck / build を先行実行
  - `integration` で PostgreSQL service / Prisma migrate / seed / API-Web起動 / smoke を実行
  - checkoutの `show-progress: false` を追加
  - typecheck failure時に `typecheck-diagnostics` artifactを出力
  - build failure時に `build-diagnostics` artifactを出力
- GitHub Actions `MVP verification` run #10 を確認
  - `static-check` の `Typecheck` で failure
  - `integration` は skipped
- GitHub Actions `MVP verification` run #11 を確認
  - `Typecheck` は failure
  - `typecheck-diagnostics` artifact のアップロードは success
  - artifactから `packages/db` の Node types 不足を確認
- `packages/db/tsconfig.json` を更新
  - `compilerOptions.types: ["node"]` を追加
- GitHub Actions `MVP verification` run #12 を確認
  - `packages/db` のtypecheckは通過
  - `apps/api` 側の Node types 不足で failure
- `apps/api/tsconfig.json` を更新
  - `compilerOptions.types: ["node"]` を追加
- GitHub Actions `MVP verification` run #13 を確認
  - `Typecheck` は success
  - `Build` は failure
  - `integration` は skipped
- build diagnostics artifactから `apps/api/tsconfig.json` の `rootDir` 明示不足を確認
- `apps/api/tsconfig.json` を再更新
  - `compilerOptions.rootDir: "src"` を追加
- GitHub Actions `MVP verification` run #15 を確認
  - `static-check` は success
  - `integration` は success
  - `Install dependencies` / `Generate Prisma client` / `Typecheck` / `Build` は success
  - PostgreSQL service、Prisma migrate、seed、API/Web起動、API待機、Web待機、HTTP smokeは success

## 変更ファイル

- `.github/workflows/mvp-verification.yml`
- `packages/db/tsconfig.json`
- `apps/api/tsconfig.json`
- `docs/AI_WORK_STATE.md`

## 未完了

- ローカルでの `pnpm install`
- lockfile生成と依存バージョン固定の最終確認
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

- Actionsでは `MVP verification` run #15 が成功したが、ローカル検証は未実行
- `pnpm install --no-frozen-lockfile` によりActions上では依存解決できているが、lockfileはまだ未生成
- lockfile生成後に依存バージョンと `packageManager` 固定の整合を確認する
- workflow内の `pnpm db:migrate` はActions run #15で成功したが、正式なmigrationファイル運用は別途確認する
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

- pnpm install: ローカル未実行 / Actionsではrun #15成功
- lockfile生成: ローカル未実行
- DB起動: ローカル未実行 / Actions PostgreSQL serviceはrun #15成功
- Prisma generate: ローカル未実行 / Actions run #15成功
- Prisma migrate: ローカル未実行 / Actions run #15成功
- seed実行: ローカル未実行 / Actions run #15成功
- API起動: ローカル未実行 / Actions run #15成功
- Web起動: ローカル未実行 / Actions run #15成功
- 実HTTP smoke: ローカル未実行 / Actions run #15成功
- ブラウザ確認: 未実行
- スマホ幅確認: 未実行
- GitHub Actions workflow: run #15 completed / success

## 次回作業

1. `feat/mvp-foundation-v2` / PR #1 を起点にする
2. PR #1 の最新headとActions最新runを確認する
3. ネットワーク利用可能なローカル環境で `pnpm install` を実行し、lockfileを生成する
4. lockfile生成後に依存バージョンと `packageManager` の固定方針を確認する
5. Docker PostgreSQLを起動する
6. Prisma generate / migrate / seed をローカル実行する
7. APIを起動し、主要エンドポイントを実HTTP確認する
8. Webを起動し、PC幅・スマホ幅で確認する
9. `bash tools/license_base_smoke.sh` をローカル実行する
10. FE Practice Labトップ、演習画面、回答選択、採点結果表示をブラウザ確認する
11. テキスト限定問題のvisualHtml非表示取込ルートを設計する
12. 進捗保存API、見直し・復習API、課金権限APIの実装へ進む

## 推定完成度

- 企画・要件: 49%
- アーキテクチャ: 45%
- DB設計: 45%
- UI方針: 37%
- 実装: 41%
- 検証: 35%
- 引継ぎ整備: 97%

## 次回用短縮プロンプト

Shota-Zaki/License-Base リポジトリの `CHATGPT_READ_FIRST.md` と `docs/AI_WORK_STATE.md` を最初に確認してください。`feat/mvp-foundation-v2` / PR #1 を起点に、License Base / Engineer-License-Lab / FE Practice Lab のWeb MVPを進めてください。前回、`.github/workflows/mvp-verification.yml` を `static-check` と `integration` に分割し、typecheck/build diagnostics artifactを追加しました。`packages/db/tsconfig.json` と `apps/api/tsconfig.json` に Node types を明示し、`apps/api/tsconfig.json` に `rootDir: "src"` を追加しました。GitHub Actions `MVP verification` run #15 は completed / success で、static-check、build、PostgreSQL service、Prisma migrate、seed、API/Web起動、API/Web待機、HTTP smoke まで成功済みです。ただし、この実行環境では外部DNS不可、pnpm未導入、Docker未導入のため、ローカルの pnpm install、lockfile生成、DB起動、Prisma generate / migrate / seed、API/Web起動、実HTTP smoke、PC幅・スマホ幅確認は未実行です。未実行チェックは成功扱いせず、次はネットワーク利用可能なローカル環境でlockfile生成とローカル実行検証を進めてください。最後に差分ログ、保留、進捗サマリー、残作業一覧、推定完成度、次回用短縮プロンプトを出してください。
