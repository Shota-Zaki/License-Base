'use client';

import { useMemo, useState } from 'react';
import {
  addBookmark,
  gradePracticeSet,
  saveAttemptAnswers,
  startAttempt,
  submitAttempt,
  type GradePracticeSetResult,
  type PracticeSetDetail
} from '../../../../../lib/api';

type PracticeSetClientProps = {
  practiceSet: PracticeSetDetail;
};

const DEFAULT_MVP_USER_EMAIL = 'mvp-user@example.test';

export function PracticeSetClient({ practiceSet }: PracticeSetClientProps) {
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [gradeResult, setGradeResult] = useState<GradePracticeSetResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState(DEFAULT_MVP_USER_EMAIL);
  const [lastSavedAttemptId, setLastSavedAttemptId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const resultByQuestionId = useMemo(() => {
    const entries = gradeResult?.results.map((result) => [result.questionId, result] as const) ?? [];
    return new Map(entries);
  }, [gradeResult]);

  const normalizedUserEmail = userEmail.trim().toLowerCase();
  const answeredCount = Object.keys(selectedChoices).length;
  const canSubmit = answeredCount === practiceSet.questions.length && practiceSet.questions.length > 0 && !isSubmitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setNoticeMessage(null);
    setLastSavedAttemptId(null);

    const answers = Object.entries(selectedChoices).map(([questionId, choiceId]) => ({ questionId, choiceId }));

    try {
      if (normalizedUserEmail) {
        const attempt = await startAttempt(practiceSet.slug, normalizedUserEmail);
        await saveAttemptAnswers(attempt.id, answers, normalizedUserEmail);
        const result = await submitAttempt(attempt.id, normalizedUserEmail);
        setLastSavedAttemptId(result.attemptId);
        setGradeResult({
          practiceSetId: result.practiceSetId,
          totalCount: result.totalCount,
          correctCount: result.correctCount,
          scorePercent: result.scorePercent,
          results: result.results
        });
        setNoticeMessage('提出結果を進捗と見直しに保存しました。');
      } else {
        const result = await gradePracticeSet(practiceSet.slug, answers);
        setGradeResult(result);
        setNoticeMessage('ログイン識別なしで採点しました。進捗保存は行っていません。');
      }
    } catch {
      setErrorMessage('採点または進捗保存APIに接続できませんでした。API起動後にもう一度確認してください。');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleBookmark(questionId: string) {
    setErrorMessage(null);
    setNoticeMessage(null);

    if (!normalizedUserEmail) {
      setErrorMessage('見直しに追加するには、MVP用メールを入力してください。');
      return;
    }

    try {
      await addBookmark(questionId, normalizedUserEmail);
      setNoticeMessage('見直しに追加しました。');
    } catch {
      setErrorMessage('見直し追加APIに接続できませんでした。');
    }
  }

  function resetAnswers() {
    setSelectedChoices({});
    setGradeResult(null);
    setLastSavedAttemptId(null);
    setErrorMessage(null);
    setNoticeMessage(null);
  }

  return (
    <>
      <section className="practice-submit-panel" aria-label="演習の提出">
        <div>
          <div className="eyebrow">Submit</div>
          <h2>解答を選択して提出</h2>
          <p>{answeredCount} / {practiceSet.questions.length} 問に回答済み</p>
          <label className="input-label" htmlFor="mvp-user-email">MVP用メール</label>
          <input
            id="mvp-user-email"
            className="text-input"
            type="email"
            value={userEmail}
            onChange={(event) => setUserEmail(event.target.value)}
            placeholder="progress@example.test"
          />
          <p className="helper-text">入力時は進捗・見直しに保存します。空欄の場合は公開採点のみ実行します。</p>
        </div>
        <div className="action-row">
          {gradeResult ? <button className="button" type="button" onClick={resetAnswers}>もう一度解く</button> : null}
          <button className="button primary" type="button" disabled={!canSubmit || Boolean(gradeResult)} onClick={handleSubmit}>
            {isSubmitting ? '採点中' : normalizedUserEmail ? '保存して提出する' : '解答を提出する'}
          </button>
        </div>
      </section>

      {gradeResult ? (
        <section className="score-panel" aria-label="採点結果">
          <div>
            <div className="eyebrow">Score</div>
            <h2>{gradeResult.correctCount} / {gradeResult.totalCount} 問正解</h2>
            <p>正答率 {gradeResult.scorePercent}%</p>
          </div>
          {lastSavedAttemptId ? <span className="badge">進捗保存済み</span> : <span className="badge muted">公開採点</span>}
        </section>
      ) : null}

      {noticeMessage ? <p className="notice-text">{noticeMessage}</p> : null}
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
              <div className="question-heading-row">
                <h2>{question.title ?? '問題'}</h2>
                <button className="button small-button" type="button" onClick={() => void handleBookmark(question.id)}>
                  見直しに追加
                </button>
              </div>
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
                          setNoticeMessage(null);
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
