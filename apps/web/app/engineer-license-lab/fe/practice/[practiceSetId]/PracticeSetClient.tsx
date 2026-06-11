'use client';

import { useMemo, useState } from 'react';
import { gradePracticeSet, type GradePracticeSetResult, type PracticeSetDetail } from '../../../../../lib/api';

type PracticeSetClientProps = {
  practiceSet: PracticeSetDetail;
};

export function PracticeSetClient({ practiceSet }: PracticeSetClientProps) {
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [gradeResult, setGradeResult] = useState<GradePracticeSetResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resultByQuestionId = useMemo(() => {
    return new Map(gradeResult?.results.map((result) => [result.questionId, result]) ?? []);
  }, [gradeResult]);

  const answeredCount = Object.keys(selectedChoices).length;
  const canSubmit = answeredCount === practiceSet.questions.length && practiceSet.questions.length > 0 && !isSubmitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await gradePracticeSet(
        practiceSet.slug,
        Object.entries(selectedChoices).map(([questionId, choiceId]) => ({ questionId, choiceId }))
      );
      setGradeResult(result);
    } catch {
      setErrorMessage('採点APIに接続できませんでした。API起動後にもう一度確認してください。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="practice-submit-panel" aria-label="演習の提出">
        <div>
          <div className="eyebrow">Submit</div>
          <h2>解答を選択して提出</h2>
          <p>{answeredCount} / {practiceSet.questions.length} 問に回答済み</p>
        </div>
        <button className="button primary" type="button" disabled={!canSubmit} onClick={handleSubmit}>
          {isSubmitting ? '採点中' : '解答を提出する'}
        </button>
      </section>

      {gradeResult ? (
        <section className="score-panel" aria-label="採点結果">
          <div className="eyebrow">Score</div>
          <h2>{gradeResult.correctCount} / {gradeResult.totalCount} 問正解</h2>
          <p>正答率 {gradeResult.scorePercent}%</p>
        </section>
      ) : null}

      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

      <section className="practice-stack" aria-label="問題演習">
        {practiceSet.questions.map((question, questionIndex) => {
          const selectedChoiceId = selectedChoices[question.id];
          const result = resultByQuestionId.get(question.id);

          return (
            <article className="card question-card" key={question.id}>
              <div className="card-topline">
                <span className="badge">問{questionIndex + 1}</span>
                <span className="small-text">{question.unit.title} / 難易度 {question.difficulty}</span>
              </div>
              <h2>{question.title ?? '問題'}</h2>
              <p className="question-body">{question.body}</p>
              <ol className="choice-list labeled-choice-list">
                {question.choices.map((choice) => {
                  const isSelected = selectedChoiceId === choice.id;
                  const isCorrectAfterSubmit = result?.correctChoice?.id === choice.id;
                  const isSubmittedWrongChoice = Boolean(result && isSelected && !result.isCorrect);
                  const className = [
                    'choice-button',
                    isSelected ? 'selected-choice' : '',
                    isCorrectAfterSubmit ? 'correct-choice' : '',
                    isSubmittedWrongChoice ? 'wrong-choice' : ''
                  ].filter(Boolean).join(' ');

                  return (
                    <li key={choice.id}>
                      <button
                        className={className}
                        type="button"
                        disabled={Boolean(gradeResult)}
                        onClick={() => {
                          setSelectedChoices((current) => ({ ...current, [question.id]: choice.id }));
                          setGradeResult(null);
                        }}
                      >
                        <span className="choice-label">{choice.label}</span>
                        <span>{choice.body}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              {result ? (
                <div className="explanation-panel">
                  <div className="eyebrow">Result</div>
                  <h3>{result.isCorrect ? '正解' : '不正解'}</h3>
                  {result.correctChoice ? <p className="answer-line">正答: {result.correctChoice.label}</p> : null}
                  <p>{result.explanation?.bodyMd ?? 'この問題の解説は準備中です。'}</p>
                </div>
              ) : (
                <div className="explanation-panel muted-panel">
                  <div className="eyebrow">Result</div>
                  <h3>解答確認</h3>
                  <p>正答と解説は提出後に表示されます。</p>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </>
  );
}
