import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { prisma } from '@license-base/db';

@Controller('questions')
export class QuestionsController {
  @Get('sample')
  async getSampleQuestion() {
    const question = await prisma.question.findFirst({
      where: { status: 'PUBLISHED', isFree: true },
      orderBy: { createdAt: 'asc' },
      include: {
        unit: true,
        choices: { orderBy: { sortOrder: 'asc' } },
        sources: true
      }
    });

    if (!question) {
      throw new NotFoundException({ error: { code: 'QUESTION_NOT_FOUND', message: '公開中のサンプル問題が見つかりません。' } });
    }

    return {
      data: {
        id: question.id,
        slug: question.slug,
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
      }
    };
  }

  @Get(':questionId')
  async getQuestion(@Param('questionId') questionId: string) {
    const question = await prisma.question.findFirst({
      where: { OR: [{ id: questionId }, { slug: questionId }], status: 'PUBLISHED' },
      include: {
        unit: true,
        choices: { orderBy: { sortOrder: 'asc' } },
        sources: true
      }
    });

    if (!question) {
      throw new NotFoundException({ error: { code: 'QUESTION_NOT_FOUND', message: '指定された問題が見つかりません。' } });
    }

    return {
      data: {
        id: question.id,
        slug: question.slug,
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
      }
    };
  }
}
