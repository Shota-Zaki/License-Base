'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  archiveReviewItem,
  getMyEntitlements,
  getMyProgress,
  getMyReviewItems,
  getPlans,
  removeBookmark,
  snoozeReviewItem,
  type MyEntitlements,
  type PlanSummary,
  type ProgressSnapshot,
  type ReviewItem
} from '../../../../lib/api';

const DEFAULT_MVP_USER_EMAIL = 'mvp-user@example.test';

function formatDueAt(dueAt: string | null) {
  if (!dueAt) return '期限なし';
  return new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric' }).format(new Date(dueAt));
}

export function DashboardClient() {
  const [userEmail, setUserEmail] = useState(DEFAULT_MVP_USER_EMAIL);
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [entitlements, setEntitlements] = useState<MyEntitlements | null>(null);
  const [progress, setProgress] = useState<ProgressSnapshot[]>([]);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingReviewItemId, setPendingReviewItemId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const totalAttemptedCount = useMemo(() => progress.reduce((total, item) => total + item.attemptedCount, 0), [progress]);
  const totalCorrectCount = useMemo(() => progress.reduce((total, item) => total + item.correctCount, 0), [progress]);
  const scorePercent = totalAttemptedCount > 0 ? Math.round((totalCorrectCount / totalAttemptedCount) * 100) : 0;

  async function loadDashboard(emailValue = userEmail) {
    const normalizedEmail = emailValue.trim().toLowerCase();
    if (!normalizedEmail) {
      setErrorMessage('MVP用メールを入力してください。');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setNoticeMessage(null);

    try {
      const [planResult, entitlementResult, progressResult, reviewItemResult] = await Promise.all([
        getPlans(),
        getMyEntitlements(normalizedEmail),
        getMyProgress(normalizedEmail),
        getMyReviewItems(normalizedEmail)
      ]);

      setPlans(planResult);
      setEntitlements(entitlementResult);
      setProgress(progressResult);
      setReviewItems(reviewItemResult);
    } catch {
      setErrorMessage('ダッシュボードAPIに接続できませんでした。API起動後に再読み込みしてください。');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleArchiveReviewItem(reviewItemId: string) {
    const normalizedEmail = userEmail.trim().toLowerCase();
    setPendingReviewItemId(reviewItemId);
    setErrorMessage(null);
    setNoticeMessage(null);

    try {
      await archiveReviewItem(reviewItemId, normalizedEmail);
      setReviewItems((current) => current.filter((item) => item.id !== reviewItemId));
      setNoticeMessage('復習対象を完了にしました。');
    } catch {
      setErrorMessage('復習対象の完了APIに接続できませんでした。');
    } finally {
      setPendingReviewItemId(null);
    }
  }

  async function handleSnoozeReviewItem(reviewItemId: string, days: number) {
    const normalizedEmail = userEmail.trim().toLowerCase();
    setPendingReviewItemId(reviewItemId);
    setErrorMessage(null);
    setNoticeMessage(null);

    try {
      const updatedItem = await snoozeReviewItem(reviewItemId, days, normalizedEmail);
      setReviewItems((current) => current.map((item) => (item.id === reviewItemId ? updatedItem : item)));
      setNoticeMessage(`復習対象を${days}日後に移動しました。`);
    } catch {
      setErrorMessage('復習対象のスヌーズAPIに接続できませんでした。');
    } finally {
      setPendingReviewItemId(null);
    }
  }

  async function handleRemoveBookmark(bookmarkId: string) {
    const normalizedEmail = userEmail.trim().toLowerCase();
    setPendingReviewItemId(bookmarkId);
    setErrorMessage(null);
    setNoticeMessage(null);

    try {
      await removeBookmark(bookmarkId, normalizedEmail);
      setReviewItems((current) => current.filter((item) => item.bookmarkId !== bookmarkId));
      setNoticeMessage('手動追加した見直しを削除しました。');
    } catch {
      setErrorMessage('見直し削除APIに接続できませんでした。');
    } finally {
      setPendingReviewItemId(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadDashboard();
  }

  useEffect(() => {
    void loadDashboard(DEFAULT_MVP_USER_EMAIL);
  }, []);

  return (
    <section className="dashboard-stack" aria-label="学習ダッシュボード">
      <form className="dashboard-toolbar" onSubmit={handleSubmit}>
        <div>
          <label className="input-label" htmlFor="dashboard-user-email">MVP用メール</label>
          <input
            id="dashboard-user-email"
            className="text-input"
            type="email"
            value={userEmail}
            onChange={(event) => setUserEmail(event.target.value)}
            placeholder="progress@example.test"
          />
          <p className="helper-text">演習画面と同じメールを使うと、保存した進捗・見直しを確認できます。</p>
        </div>
        <button className="button primary" type="submit" disabled={isLoading}>
          {isLoading ? '読み込み中' : '再読み込み'}
        </button>
      </form>

      {noticeMessage ? <p className="notice-text">{noticeMessage}</p> : null}
      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

      <section className="metric-grid" aria-label="進捗サマリー">
        <article className="metric-card">
          <div className="eyebrow">Answered</div>
          <strong>{totalAttemptedCount}</strong>
          <span>回答数</span>
        </article>
        <article className="metric-card">
          <div className="eyebrow">Correct</div>
          <strong>{totalCorrectCount}</strong>
          <span>正解数</span>
        </article>
        <article className="metric-card">
          <div className="eyebrow">Rate</div>
          <strong>{scorePercent}%</strong>
          <span>正答率</span>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="card dashboard-card">
          <div className="card-topline">
            <div>
              <div className="eyebrow">Progress</div>
              <h2>単元別進捗</h2>
            </div>
            <span className="badge muted">{progress.length}件</span>
          </div>
          {progress.length > 0 ? (
            <div className="stacked-list">
              {progress.map((item) => (
                <div className="list-row" key={item.id}>
                  <div>
                    <strong>{item.unit?.title ?? '未分類'}</strong>
                    <p>{item.attemptedCount}問回答 / {item.correctCount}問正解</p>
                  </div>
                  <span className="badge">{item.attemptedCount > 0 ? Math.round((item.correctCount / item.attemptedCount) * 100) : 0}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p>保存済みの進捗はまだありません。</p>
          )}
        </article>

        <article className="card dashboard-card">
          <div className="card-topline">
            <div>
              <div className="eyebrow">Review</div>
              <h2>見直し</h2>
            </div>
            <span className="badge muted">{reviewItems.length}件</span>
          </div>
          {reviewItems.length > 0 ? (
            <div className="stacked-list">
              {reviewItems.map((item) => {
                const isBookmark = item.sourceType === 'bookmark';
                const isPending = pendingReviewItemId === item.id || pendingReviewItemId === item.bookmarkId;

                return (
                  <div className="list-row review-list-row" key={item.id}>
                    <div>
                      <strong>{item.question.title ?? item.question.slug}</strong>
                      <p>{item.question.unit.title} / 難易度 {item.question.difficulty} / {formatDueAt(item.dueAt)}</p>
                    </div>
                    <div className="review-action-row">
                      <span className="badge muted">{isBookmark ? '手動追加' : '復習対象'}</span>
                      {isBookmark && item.bookmarkId ? (
                        <button className="button small-button" type="button" disabled={isPending} onClick={() => void handleRemoveBookmark(item.bookmarkId as string)}>
                          削除
                        </button>
                      ) : (
                        <>
                          <button className="button small-button" type="button" disabled={isPending} onClick={() => void handleSnoozeReviewItem(item.id, 3)}>
                            3日後
                          </button>
                          <button className="button small-button" type="button" disabled={isPending} onClick={() => void handleSnoozeReviewItem(item.id, 7)}>
                            7日後
                          </button>
                          <button className="button small-button" type="button" disabled={isPending} onClick={() => void handleArchiveReviewItem(item.id)}>
                            完了
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>見直し対象はまだありません。不正解または手動追加した問題が表示されます。</p>
          )}
        </article>

        <article className="card dashboard-card">
          <div className="card-topline">
            <div>
              <div className="eyebrow">Access</div>
              <h2>権限</h2>
            </div>
            <span className="badge">{entitlements?.user.accessLevel ?? 'FREE'}</span>
          </div>
          {entitlements ? (
            <div className="stacked-list">
              <div className="list-row">
                <div>
                  <strong>{entitlements.user.email}</strong>
                  <p>現在のアクセス: {entitlements.user.accessLevel}</p>
                </div>
              </div>
              {entitlements.entitlements.length > 0 ? entitlements.entitlements.map((item) => (
                <div className="list-row" key={item.id}>
                  <div>
                    <strong>{item.scope}</strong>
                    <p>{item.accessLevel} / {item.course?.title ?? item.certification?.displayName ?? item.lab?.nameJa ?? '全体'}</p>
                  </div>
                </div>
              )) : <p>個別権限はまだありません。</p>}
            </div>
          ) : (
            <p>権限情報を読み込んでください。</p>
          )}
        </article>

        <article className="card dashboard-card">
          <div className="card-topline">
            <div>
              <div className="eyebrow">Plans</div>
              <h2>プラン</h2>
            </div>
            <span className="badge muted">MVP</span>
          </div>
          <div className="stacked-list">
            {plans.map((plan) => (
              <div className="list-row" key={plan.id}>
                <div>
                  <strong>{plan.name}</strong>
                  <p>{plan.description ?? '説明未設定'}</p>
                </div>
                <span className="badge">{plan.priceMonthlyJpy === null ? '未定' : `${plan.priceMonthlyJpy}円`}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </section>
  );
}
