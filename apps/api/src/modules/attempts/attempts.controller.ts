import { BadRequestException, Body, Controller, Get, Headers, NotFoundException, Param, Post } from '@nestjs/common';
import { prisma } from '@license-base/db';
import { requireUserByEmail } from '../auth/user-context.js';

type StartAttemptBody = {
  practiceSetId?: string;
};

type AttemptAnswerInput = {
  questionId?: string;
  choiceId?: string | null;
};

type SaveAttemptAnswersBody = AttemptAnswerInput & {
  answers?: AttemptAnswerInput[];
};

function normalizeAnswers(body: SaveAttemptAnswersBody): Array<{ questionId: string; choiceId: string | null }> {
  const sourceAnswers = Array.isArray(body.answers) ? body.answers : body.questionId ? [body] : [];

  const normalized = sourceAnswers
    .filter((answer): answer is { questionId: string; choiceId?: string | null } => Boolean(answer.questionId))
    .map((answer) => ({ questionId: answer.questionId, choiceId: answer.choiceId ?? null }));

  if (normalized.length === 0) {
    throw new BadRequestException({
      error: { code: 'ANSWERS_REQUIRED', message: '保存する解答を指定してください。' }
    });
  }

  return normalized;
}

@Controller('attempts')
export class AttemptsController {
  @Post()
  async startAttempt(@Headers('x-user-email') emailHeader: string | string[] | undefined, @Body() body: StartAttemptBody) {
    if (!body.practiceSetId) {
      throw new BadRequestException({ error: { code: 'PRACTICE_SET_REQUIRED', message: '演習セットIDを指定してください。' } });
    }

    const user = await requireUserByEmail(emailHeader);
    const practiceSet = await prisma.practiceSet.findFirst({
      where: { OR: [{ id: body.practiceSetId }, { slug: body.practiceSetId }], isPublished: true },
      include: {
        questions: { orderBy: { sortOrder: 'asc' } }
      }
    });

    if (!practiceSet) {
      throw new NotFoundException({ error: { code: 'PRACTICE_SET_NOT_FOUND', message: '指定された演習セットが見つかりません。' } });
    }

    const attempt = await prisma.attempt.create({
      data: {
        userId: user.id,
        practiceSetId: practiceSet.id,
        totalCount: practiceSet.questions.length
      }
    });

    return {
      data: {
        id: attempt.id,
        practiceSetId: practiceSet.id,
        practiceSetSlug: practiceSet.slug,
        status: attempt.status,
        totalCount: attempt.totalCount,
        correctCount: attempt.correctCount,
        scorePercent: attempt.scorePercent,
        startedAt: attempt.startedAt
      }
    };
  }

  @Post(':attemptId/answers')
  async saveAnswers(
    @Headers('x-user-email') emailHeader: string | string[] | undefined,
    @Param('attemptId') attemptId: string,
    @Body() body: SaveAttemptAnswersBody
  ) {
    const user = await requireUserByEmail(emailHeader);
    const attempt = await prisma.attempt.findFirst({
      where: { id: attemptId, userId: user.id },
      include: {
        practiceSet: {
          include: { questions: true }
        }
      }
    });

    if (!attempt || !attempt.practiceSet) {
      throw new NotFoundException({ error: { code: 'ATTEMPT_NOT_FOUND', message: '指定された演習履歴が見つかりません。' } });
    }

    if (attempt.status !== 'IN_PROGRESS') {
      throw new BadRequestException({ error: { code: 'ATTEMPT_ALREADY_SUBMITTED', message: '提出済みの演習履歴は変更できません。' } });
    }

    const allowedQuestionIds = new Set(attempt.practiceSet.questions.map((item) => item.questionId));
    const normalizedAnswers = normalizeAnswers(body);
    const savedAnswers = [];

    for (const answer of normalizedAnswers) {
      if (!allowedQuestionIds.has(answer.questionId)) {
        throw new BadRequestException({ error: { code: 'QUESTION_NOT_IN_ATTEMPT', message: '演習セットに含まれない問題が指定されています。' } });
      }

      const selectedChoice = answer.choiceId
        ? await prisma.questionChoice.findFirst({ where: { id: answer.choiceId, questionId: answer.questionId } })
        : null;

      if (answer.choiceId && !selectedChoice) {
        throw new BadRequestException({ error: { code: 'CHOICE_NOT_FOUND', message: '指定された選択肢が見つかりません。' } });
      }

      const savedAnswer = await prisma.attemptAnswer.upsert({
        where: { attemptId_questionId: { attemptId: attempt.id, questionId: answer.questionId } },
        update: {
          choiceId: answer.choiceId,
          isCorrect: Boolean(selectedChoice?.isCorrect),
          answeredAt: new Date()
        },
        create: {
          attemptId: attempt.id,
          questionId: answer.questionId,
          choiceId: answer.choiceId,
          isCorrect: Boolean(selectedChoice?.isCorrect)
        }
      });

      savedAnswers.push({
        questionId: savedAnswer.questionId,
        choiceId: savedAnswer.choiceId,
        answeredAt: savedAnswer.answeredAt
      });
    }

    return { data: { attemptId: attempt.id, savedAnswers } };
  }

  @Post(':attemptId/submit')
  async submitAttempt(@Headers('x-user-email') emailHeader: string | string[] | undefined, @Param('attemptId') attemptId: string) {
    const user = await requireUserByEmail(emailHeader);
    const attempt = await prisma.attempt.findFirst({
      where: { id: attemptId, userId: user.id },
      include: {
        answers: true,
        practiceSet: {
          include: {
            questions: {
              orderBy: { sortOrder: 'asc' },
              include: {
                question: {
                  include: {
                    unit: true,
                    choices: { orderBy: { sortOrder: 'asc' } },
                    explanation: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!attempt || !attempt.practiceSet) {
      throw new NotFoundException({ error: { code: 'ATTEMPT_NOT_FOUND', message: '指定された演習履歴が見つかりません。' } });
    }

    const answerByQuestionId = new Map(attempt.answers.map((answer) => [answer.questionId, answer] as const));
    const rows = attempt.practiceSet.questions.map(({ question, sortOrder }) => {
      const answer = answerByQuestionId.get(question.id);
      const correctChoice = question.choices.find((choice) => choice.isCorrect) ?? null;
      const submittedChoiceId = answer?.choiceId ?? null;
      const isCorrect = Boolean(correctChoice && submittedChoiceId === correctChoice.id);

      return {
        questionId: question.id,
        slug: question.slug,
        sortOrder,
        unit: { id: question.unit.id, slug: question.unit.slug, title: question.unit.title },
        submittedChoiceId,
        isCorrect,
        correctChoice: correctChoice ? { id: correctChoice.id, label: correctChoice.label, body: correctChoice.body } : null,
        explanation: question.explanation ? { bodyMd: question.explanation.bodyMd } : null
      };
    });

    const correctCount = rows.filter((row) => row.isCorrect).length;
    const scorePercent = rows.length > 0 ? Math.round((correctCount / rows.length) * 100) : 0;
    const submittedAt = new Date();

    const updatedAttempt = await prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        status: 'SUBMITTED',
        submittedAt,
        totalCount: rows.length,
        correctCount,
        scorePercent
      }
    });

    const progressByUnit = new Map<string, { completedCount: number; correctCount: number; attemptedCount: number }>();
    for (const row of rows) {
      const current = progressByUnit.get(row.unit.id) ?? { completedCount: 0, correctCount: 0, attemptedCount: 0 };
      current.completedCount += 1;
      current.attemptedCount += 1;
      current.correctCount += row.isCorrect ? 1 : 0;
      progressByUnit.set(row.unit.id, current);

      if (!row.isCorrect) {
        await prisma.reviewItem.upsert({
          where: { userId_questionId: { userId: user.id, questionId: row.questionId } },
          update: { reason: 'incorrect_attempt', dueAt: null },
          create: { userId: user.id, questionId: row.questionId, reason: 'incorrect_attempt' }
        });
      }
    }

    for (const [unitId, snapshot] of progressByUnit.entries()) {
      await prisma.progressSnapshot.upsert({
        where: { userId_unitId: { userId: user.id, unitId } },
        update: { ...snapshot, lastStudiedAt: submittedAt },
        create: { userId: user.id, unitId, ...snapshot, lastStudiedAt: submittedAt }
      });
    }

    return {
      data: {
        attemptId: updatedAttempt.id,
        practiceSetId: attempt.practiceSet.id,
        status: updatedAttempt.status,
        totalCount: rows.length,
        correctCount,
        scorePercent,
        submittedAt,
        results: rows
      }
    };
  }

  @Get(':attemptId/result')
  async getResult(@Headers('x-user-email') emailHeader: string | string[] | undefined, @Param('attemptId') attemptId: string) {
    const user = await requireUserByEmail(emailHeader);
    const attempt = await prisma.attempt.findFirst({
      where: { id: attemptId, userId: user.id },
      include: {
        answers: true,
        practiceSet: {
          include: {
            questions: {
              orderBy: { sortOrder: 'asc' },
              include: {
                question: {
                  include: {
                    unit: true,
                    choices: { orderBy: { sortOrder: 'asc' } },
                    explanation: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!attempt || !attempt.practiceSet) {
      throw new NotFoundException({ error: { code: 'ATTEMPT_NOT_FOUND', message: '指定された演習履歴が見つかりません。' } });
    }

    const shouldShowSolutions = attempt.status === 'SUBMITTED';
    const answerByQuestionId = new Map(attempt.answers.map((answer) => [answer.questionId, answer] as const));
    const results = attempt.practiceSet.questions.map(({ question, sortOrder }) => {
      const answer = answerByQuestionId.get(question.id);
      const correctChoice = question.choices.find((choice) => choice.isCorrect) ?? null;
      const submittedChoiceId = answer?.choiceId ?? null;

      return {
        questionId: question.id,
        slug: question.slug,
        sortOrder,
        unit: { id: question.unit.id, slug: question.unit.slug, title: question.unit.title },
        submittedChoiceId,
        isCorrect: Boolean(answer?.isCorrect),
        correctChoice: shouldShowSolutions && correctChoice ? { id: correctChoice.id, label: correctChoice.label, body: correctChoice.body } : null,
        explanation: shouldShowSolutions && question.explanation ? { bodyMd: question.explanation.bodyMd } : null
      };
    });

    return {
      data: {
        attemptId: attempt.id,
        practiceSetId: attempt.practiceSet.id,
        status: attempt.status,
        totalCount: attempt.totalCount,
        correctCount: attempt.correctCount,
        scorePercent: attempt.scorePercent,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        results
      }
    };
  }
}
