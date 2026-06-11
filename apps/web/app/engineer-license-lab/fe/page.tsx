import { getCourseDetail } from '../../../lib/api';

export const dynamic = 'force-dynamic';

export default async function FePracticeLabPage() {
  const course = await getCourseDetail('fe-practice-lab');

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="eyebrow">{course.lab.nameEn}</div>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div className="action-row">
          <a className="button primary" href="/engineer-license-lab/fe/practice/fe-free-sample-set">無料サンプル演習を始める</a>
          <a className="button" href="#units">単元を見る</a>
        </div>
      </section>

      <section className="section-heading" id="units">
        <div>
          <div className="eyebrow">Units</div>
          <h2>単元一覧</h2>
        </div>
        <p>単元別の入口、無料演習、解説表示を先に固めます。</p>
      </section>

      <section className="card-grid" aria-label="単元一覧">
        {course.units.map((unit) => (
          <article className="card unit-card" key={unit.slug}>
            <div className="card-topline">
              <span className="badge muted">{unit.sortOrder}</span>
              <span className="small-text">問題 {unit.questionCount}</span>
            </div>
            <h2>{unit.title}</h2>
            <p>{unit.description ?? '演習・解説・復習をこの単元に紐づけて管理します。'}</p>
          </article>
        ))}
      </section>

      <section className="section-heading">
        <div>
          <div className="eyebrow">Practice</div>
          <h2>演習セット</h2>
        </div>
      </section>

      <section className="card-grid two-column" aria-label="演習セット">
        {course.practiceSets.map((practiceSet) => (
          <article className="card" key={practiceSet.slug}>
            <div className="card-topline">
              <span className="badge">{practiceSet.isFree ? 'Free' : practiceSet.accessLevel}</span>
              <span className="small-text">{practiceSet.questionCount}問</span>
            </div>
            <h2>{practiceSet.title}</h2>
            <p>{practiceSet.description}</p>
            <div className="card-action-row">
              <a className="button primary" href="/engineer-license-lab/fe/practice/fe-free-sample-set">演習を開く</a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
