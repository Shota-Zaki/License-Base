import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { prisma } from '@license-base/db';

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
      where: {
        OR: [{ id: practiceSetId }, { slug: practiceSetId }],
        isPublished: true
      },
      include: {
        course: true,
        questions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            question: {
              include: {
                unit: true,
                choices: { orderBy: { sortOrder: 'asc' } },
                explanation: true,
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
          choices: question.choices.map((choice) => ({ id: choice.id, label: choice.label, body: choice.body, isCorrect: choice.isCorrect })),
          explanation: question.explanation ? { bodyMd: question.explanation.bodyMd } : null,
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
}
