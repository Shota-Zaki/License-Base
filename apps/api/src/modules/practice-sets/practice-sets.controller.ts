import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { prisma } from '@license-base/db';

type GradeAnswer = {
  questionId?: string;
  choiceId?: string;
};

type GradePracticeSetBody = {
  answers?: GradeAnswer[];
};

@Controller('practice-sets')
export class PracticeSetsController {
  @Get()
  async listPracticeSets() {
    const practiceSets = await prisma.practiceSet.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'asc' },
      include: {
        course: true,
        _count: { select: { questions: true } }
      }
    });

    return {
      data: practiceSets.map((practiceSet) => ({
        id: practiceSet.id,
        slug: practiceSet.slug,
        title: practiceSet.title,
        description: practiceSet.description,
        accessLevel: practiceSet.accessLevel,
        isFree: practiceSet.isFree,
        course: {
          id: practiceSet.course.id,
          slug: practiceSet.course.slug,
          title: practiceSet.course.title
        },
        questionCount: practiceSet._count.questions
      }))
    };
  }

  @Get(':practiceSetId')
  async getPracticeSet(@Param('practiceSetId') practiceSetId: string) {
    const practiceSet = await prisma.practiceSet.findFirst({
      where: { OR: [{ id: practiceSetId }, { slug: practiceSetId }], isPublished: true },
      include: {
        course: true,
        questions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            question: {
              include: {
                unit: true,
                choices: { orderBy: { sortOrder: 'asc' } },
                sources: true
              }
            }
          }
        }
      }
    });

    if (!practiceSet) {
      throw new NotFoundException({ error: { code: 'PRACTICE_SET_NOT_FOUND', message: '指定された演習セットが見つかりません。' } });
    }

    return {
      data: {
        id: practiceSet.id,
        slug: practiceSet.slug,
        title: practiceSet.title,
        description: practiceSet.description,
        accessLevel: practiceSet.accessLevel,
        isFree: practiceSet.isFree,
        course: {
          id: practiceSet.course.id,
          slug: practiceSet.course.slug,
          title: practiceSet.course.title
        },
        questions: practiceSet.questions.map(({ question, sortOrder }) => ({
          id: question.id,
          slug: question.slug,
          sortOrder,
          title: question.title,
          body: question.body,
          difficulty: question.difficulty,
          isFree: question.isFree,
          accessLevel: question.accessLevel,
          unit: { id: question.unit.id, slug: question.unit.slug, title: question.unit.title },
          choices: question.choices.map((choice) => ({ id: choice.id, label: choice.label, body: choice.body })),
          sources: question.sources.map((source) => ({
            sourceType: source.sourceType,
            sourceName: source.sourceName,
            sourceUrl: source.sourceUrl,
            licenseNote: source.licenseNote,
            verificationStatus: source.verificationStatus
          }))
        }))
      }
    };
  }

  @Post(':practiceSetId/grade')
  async gradePracticeSet(@Param('practiceSetId') practiceSetId: string, @Body() body: GradePracticeSetBody) {
    const practiceSet = await prisma.practiceSet.findFirst({
      where: { OR: [{ id: practiceSetId }, { slug: practiceSetId }], isPublished: true },
      include: {
        questions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            question: {
              include: {
                choices: { orderBy: { sortOrder: 'asc' } },
                explanation: true
              }
            }
          }
        }
      }
    });

    if (!practiceSet) {
      throw new NotFoundException({ error: { code: 'PRACTICE_SET_NOT_FOUND', message: '指定された演習セットが見つかりません。' } });
    }

    const answerByQuestionId = new Map(
      (body.answers ?? [])
        .filter((answer): answer is { questionId: string; choiceId: string } => Boolean(answer.questionId && answer.choiceId))
        .map((answer) => [answer.questionId, answer.choiceId])
    );

    const results = practiceSet.questions.map(({ question }) => {
      const correctChoice = question.choices.find((choice) => choice.isCorrect) ?? null;
      const submittedChoiceId = answerByQuestionId.get(question.id) ?? null;
      const isCorrect = Boolean(correctChoice && submittedChoiceId === correctChoice.id);

      return {
        questionId: question.id,
        slug: question.slug,
        submittedChoiceId,
        isCorrect,
        correctChoice: correctChoice ? { id: correctChoice.id, label: correctChoice.label, body: correctChoice.body } : null,
        explanation: question.explanation ? { bodyMd: question.explanation.bodyMd } : null
      };
    });

    const correctCount = results.filter((result) => result.isCorrect).length;

    return {
      data: {
        practiceSetId: practiceSet.id,
        totalCount: results.length,
        correctCount,
        scorePercent: results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0,
        results
      }
    };
  }
}
