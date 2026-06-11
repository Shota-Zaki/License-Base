import { getPracticeSetDetail } from '../../../../../lib/api';

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

      <section className="practice-stack" aria-label="問題演習">
        {practiceSet.questions.map((question, questionIndex) => {
          const correctChoices = question.choices.filter((choice) => choice.isCorrect);

          return (
            <article className="card question-card" key={question.id}>
              <div className="card-topline">
                <span className="badge">問{questionIndex + 1}</span>
                <span className="small-text">{question.unit.title} / 難易度 {question.difficulty}</span>
              </div>
              <h2>{question.title ?? '問題'}</h2>
              <p className="question-body">{question.body}</p>
              <ol className="choice-list labeled-choice-list">
                {question.choices.map((choice) => (
                  <li className={choice.isCorrect ? 'choice-item correct-choice' : 'choice-item'} key={choice.id}>
                    <span className="choice-label">{choice.label}</span>
                    <span>{choice.body}</span>
                  </li>
                ))}
              </ol>
              <div className="explanation-panel">
                <div className="eyebrow">Explanation</div>
                <h3>解説</h3>
                <p>{question.explanation?.bodyMd ?? 'この問題の解説は準備中です。'}</p>
                {correctChoices.length > 0 ? (
                  <p className="answer-line">正答: {correctChoices.map((choice) => choice.label).join('、')}</p>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
