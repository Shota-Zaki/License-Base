# ARCHITECTURE

## 全体構成

License Base は資格学習全般の上位ブランド。初期MVPでは Engineer-License-Lab / FE Practice Lab をWebで提供する。

```txt
apps/web  -> Next.js App Router
apps/api  -> NestJS API
packages/db -> Prisma / PostgreSQL
packages/domain -> 共通型
packages/validation -> Zod validation
packages/api-client -> API client
packages/ui-tokens -> UI token
```

## データフロー

```txt
User
 -> Next.js Web
 -> NestJS API
 -> Prisma
 -> PostgreSQL
```

## 認証方針

- ゲストは公開ページと一部問題を閲覧可能。
- 進捗保存、復習、見直し、課金権限利用にはログインが必要。
- 認証プロバイダはSupabase Authまたは同等の外部Authを想定する。

## 課金方針

- Free / Basic を初期設計に入れる。
- 決済連携はStripe想定。
- DBでは `plans`, `subscriptions`, `entitlements` で利用権限を制御する。

## 拡張方針

FE専用設計にはしない。

```txt
Lab
 -> Certification
 -> Course
 -> Unit
 -> Lesson / Question
```

この階層により、Java Practice Lab、DB / SQL Practice Lab、Security Practice Labなどを追加できる。

## 管理方針

- 問題本文、選択肢、正答、解説、出典、確認状態を管理対象にする。
- 管理操作はaudit logに残す。
- 公式確認状態は根拠なしに変更しない。
