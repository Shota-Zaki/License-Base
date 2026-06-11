const units = [
  '科目A',
  '科目B',
  'テクノロジ系',
  'マネジメント系',
  'ストラテジ系',
  '情報セキュリティ',
  'アルゴリズム',
  'データベース'
];

export default function FePracticeLabPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="eyebrow">Engineer-License-Lab</div>
        <h1>FE Practice Lab</h1>
        <p>
          基本情報技術者試験向けに、単元別学習、問題演習、解説、復習、進捗管理を提供するMVPです。
          ゲストは一部閲覧でき、進捗保存にはログインが必要です。
        </p>
      </section>

      <section className="card-grid" aria-label="単元一覧">
        {units.map((unit) => (
          <article className="card" key={unit}>
            <h2>{unit}</h2>
            <p>演習・解説・復習をこの単元に紐づけて管理します。</p>
          </article>
        ))}
      </section>

      <section className="card" aria-label="サンプル問題">
        <h2>サンプル問題</h2>
        <p>10進数の13を2進数で表したものとして、適切なものはどれか。</p>
        <ul className="choice-list">
          {['ア 1011', 'イ 1101', 'ウ 1110', 'エ 1001'].map((choice) => (
            <li className="choice-item" key={choice}>{choice}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
