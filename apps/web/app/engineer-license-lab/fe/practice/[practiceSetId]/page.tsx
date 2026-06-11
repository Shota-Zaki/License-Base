import { getPracticeSetDetail } from '../../../../../lib/api';
import { PracticeSetClient } from './PracticeSetClient';

type PageProps = {
  params: Promise<{ practiceSetId: string }>;
};

export const dynamic = 'force-dynamic';

export default async function PracticeSetPage({ params }: PageProps) {
  const { practiceSetId } = await params;
  const practiceSet = await getPracticeSetDetail(practiceSetId);

  return (
    <main className="page-shell practice-shell">
      <section className="hero compact-hero">
        <div className="eyebrow">{practiceSet.course.title}</div>
        <h1>{practiceSet.title}</h1>
        <p>{practiceSet.description}</p>
        <div className="action-row">
          <a className="button" href="/engineer-license-lab/fe">FE Practice Labへ戻る</a>
        </div>
      </section>

      <PracticeSetClient practiceSet={practiceSet} />
    </main>
  );
}
