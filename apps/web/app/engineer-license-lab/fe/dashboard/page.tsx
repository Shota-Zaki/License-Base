import { DashboardClient } from './DashboardClient';

export const dynamic = 'force-dynamic';

export default function FeDashboardPage() {
  return (
    <main className="page-shell">
      <section className="hero compact-hero">
        <div className="eyebrow">Learning Dashboard</div>
        <h1>FE Practice Lab ダッシュボード</h1>
        <p>保存した演習結果、見直し対象、現在の権限を確認します。MVP段階ではメール入力で学習ユーザーを識別します。</p>
        <div className="action-row">
          <a className="button" href="/engineer-license-lab/fe">FE Practice Labへ戻る</a>
          <a className="button primary" href="/engineer-license-lab/fe/practice/fe-free-sample-set">演習を開く</a>
        </div>
      </section>

      <DashboardClient />
    </main>
  );
}
