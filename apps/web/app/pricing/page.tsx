export default function PricingPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="eyebrow">Pricing</div>
        <h1>Free / Basic の2段階から開始する。</h1>
        <p>
          MVPでは課金権限の土台を先に作り、価格・無料公開範囲は検証しながら確定します。
        </p>
      </section>

      <section className="card-grid">
        <article className="card">
          <h2>Free</h2>
          <p>公開ページ、一部問題、一部解説を利用できます。</p>
        </article>
        <article className="card">
          <h2>Basic</h2>
          <p>進捗保存、見直し、復習、全問題利用の土台です。</p>
        </article>
      </section>
    </main>
  );
}
