export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="eyebrow">License Base</div>
        <h1>資格学習を、続けられる形に整理する。</h1>
        <p>
          License Baseは、資格学習全般を扱う上位ブランドです。最初のMVPでは、Engineer-License-Lab配下のFE Practice Labから開始します。
        </p>
        <div className="action-row">
          <a className="button primary" href="/engineer-license-lab/fe">FE Practice Labを見る</a>
          <a className="button" href="/pricing">料金を見る</a>
        </div>
      </section>

      <section className="card-grid" aria-label="学習領域">
        <article className="card">
          <h2>Engineer-License-Lab</h2>
          <p>FE、Java、DB / SQL、Security、Cloud、Linux、Careerを扱う初期領域です。</p>
        </article>
        <article className="card">
          <h2>Web MVP</h2>
          <p>まずWebで学習体験を固め、次にPWA、将来的にExpoアプリへ展開します。</p>
        </article>
        <article className="card">
          <h2>Progress</h2>
          <p>ゲスト閲覧を許可し、ログイン後に進捗保存・復習・見直しを提供します。</p>
        </article>
      </section>
    </main>
  );
}
