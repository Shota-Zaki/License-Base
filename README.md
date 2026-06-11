# License Base MVP Starter

## 目的

License Base は資格学習全般の上位ブランドとして設計する。初期MVPでは Engineer-License-Lab 配下の FE Practice Lab をWebで提供し、その後 PWA、さらに将来的にスマホアプリへ展開できる構造にする。

## 初期方針

- 初期リリース: Web MVP
- 次段階: PWA
- 将来: Expoアプリ
- 初期教材: FE Practice Lab
- コンテンツ方針: 公式情報を確認しつつ、問題・解説はオリジナル中心
- ゲスト: 閲覧・一部演習可
- ログインユーザー: 進捗保存・見直し・復習可
- 課金: MVPから権限・プラン・購読状態の土台を持つ

## 技術スタック

- TypeScript
- Next.js App Router
- NestJS
- PostgreSQL
- Prisma
- pnpm workspace
- Turborepo

## このZIPの位置づけ

これは実装開始用の初期スターターであり、依存関係のインストール、DB起動、マイグレーション、HTTP smoke、ブラウザ確認は未実行。

## 最初の実装順

1. docs配下の設計確認
2. `.env.example` を `.env` にコピー
3. PostgreSQL接続情報を設定
4. `pnpm install`
5. `pnpm db:generate`
6. `pnpm db:migrate`
7. `pnpm dev`

## 未実行チェック

- pnpm install
- Prisma generate
- Prisma migrate
- NestJS起動
- Next.js起動
- Docker PostgreSQL起動
- 実HTTP smoke
- ブラウザ表示確認
