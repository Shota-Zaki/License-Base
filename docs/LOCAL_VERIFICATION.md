# LOCAL_VERIFICATION

## 前提

この手順は、ネットワーク、pnpm、Docker が使えるローカル環境で実行する。

このAI実行環境では以下が未実行である。

- pnpm install
- lockfile生成
- DB起動
- Prisma generate
- Prisma migrate
- seed実行
- API起動
- Web起動
- 実HTTP smoke
- ブラウザ確認
- スマホ幅確認

## 0. 事前確認

```bash
node -v
corepack --version
pnpm -v
docker --version
docker compose version
```

pnpm が未導入の場合は、Node 付属の Corepack を有効化してから再確認する。

```bash
corepack enable
pnpm -v
```

## 1. 依存関係

```bash
pnpm install
```

lockfileが生成・更新された場合は差分を確認する。

## 2. 環境変数

```bash
cp env.example .env
```

`DATABASE_URL` が `docker-compose.local.yml` のPostgreSQL設定と一致していることを確認する。

## 3. DB起動

```bash
docker compose -f docker-compose.local.yml up -d
```

DBコンテナの状態を確認する。

```bash
docker compose -f docker-compose.local.yml ps
```

## 4. Prisma

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## 5. API / Web起動

別ターミナルで起動する。

```bash
pnpm dev:api
pnpm dev:web
```

## 6. smoke

```bash
bash tools/license_base_smoke.sh
```

確認対象:

- `GET /v1/health`
- `GET /v1/courses/fe-practice-lab`
- `GET /v1/practice-sets/fe-free-sample-set`
- `POST /v1/practice-sets/fe-free-sample-set/grade`
- `/engineer-license-lab/fe`
- `/engineer-license-lab/fe/practice/fe-free-sample-set`

smokeスクリプトの機械判定対象:

- 演習取得レスポンスに問題ID・選択肢IDが含まれる
- 提出前の演習取得レスポンスに正誤・正答・解説用フィールドが含まれない
- 演習取得レスポンスから抽出した `questionId` / `choiceId` で採点APIへPOSTできる
- 採点レスポンスの `totalCount` / `correctCount` / `scorePercent` が結果行と整合する
- 採点後に正答選択肢と解説が返る

## 7. ブラウザ確認

PC幅:

- FE Practice Labトップ
- 無料サンプル演習画面
- 回答選択
- 解答提出
- 採点結果
- 解説表示
- 再挑戦

スマホ幅:

- 375px相当
- 選択肢の折返し
- 提出パネルの縦積み
- 採点結果の表示崩れ

## 8. 成功扱いにしてよい条件

- APIが起動する
- Webが起動する
- seed後に5問のサンプル演習が表示される
- 回答前に正答・解説が表示されない
- 提出後に採点結果・正答・解説が表示される
- `bash tools/license_base_smoke.sh` が最後まで成功する
- PC幅とスマホ幅で主要導線が崩れない
