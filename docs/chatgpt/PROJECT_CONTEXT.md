# PROJECT_CONTEXT

## プロジェクト名

License Base

## 目的

資格学習全般を扱う上位ブランドとして、複数分野の資格学習アプリを展開できる基盤を作る。

## 初期MVP

Engineer-License-Lab配下のFE Practice LabをWeb MVPとして実装する。

## ブランド階層

```txt
License Base
├─ Engineer-License-Lab
│  └─ FE Practice Lab
├─ Business-License-Lab
├─ Office-License-Lab
├─ Legal-License-Lab
├─ Money-License-Lab
└─ Life-License-Lab
```

## 初期スコープ

- License Baseトップ
- Engineer-License-Labトップ
- FE Practice Labトップ
- 単元一覧
- 無料サンプル問題
- 問題演習
- 解説表示
- ゲスト閲覧
- ログイン後の進捗保存
- 見直し・復習
- Free / Basicの課金権限土台
- 最小限の管理画面設計

## 初期対象外

- Expoアプリ公開
- App Store / Google Play公開
- 全資格領域の実装
- AI自動解説生成
- SNS機能
- 複雑なゲーミフィケーション

## 技術方針

- TypeScript中心
- Next.js App Router
- NestJS API
- PostgreSQL
- Prisma
- pnpm workspace
- Turborepo
- Web MVPからPWAへ拡張
- 将来的にExpoアプリへ展開

## 重要な設計判断

- FE専用DBにしない。
- Lab / Certification / Course / Unit / Questionの階層にする。
- ゲスト閲覧とログイン必須機能を分離する。
- ログイン必須機能と有料必須機能を分離する。
- 課金機能はMVPからテーブルと権限設計を持つ。
- コンテンツの公式確認状態をDBで管理する。

## 現在の実装状態

- 初期モノレポ構成あり
- Next.js Web skeletonあり
- NestJS API skeletonあり
- Prisma schema draftあり
- seed draftあり
- 共通パッケージ雛形あり
- 依存関係インストールと実起動検証は未実行

## 実装時の優先順

1. Prisma schemaの本番MVP向け精査
2. 依存関係とpackage scriptsの整合
3. DB起動とPrisma migrate
4. seed実行
5. APIをDB接続へ差し替え
6. FE Practice Labトップ強化
7. 問題一覧・問題演習画面
8. 認証・進捗保存
9. 課金権限
10. 管理画面
