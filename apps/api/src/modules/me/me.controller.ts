import { BadRequestException, Body, Controller, Delete, Get, Headers, NotFoundException, Param, Post } from '@nestjs/common';
import { prisma } from '@license-base/db';
import { requireUserByEmail } from '../auth/user-context.js';

type BookmarkBody = {
  questionId?: string;
};

@Controller('me')
export class MeController {
  @Get('progress')
  async getProgress(@Headers('x-user-email') emailHeader: string | string[] | undefined) {
    const user = await requireUserByEmail(emailHeader);
    const snapshots = await prisma.progressSnapshot.findMany({
      where: { userId: user.id },
      orderBy: [{ lastStudiedAt: 'desc' }, { updatedAt: 'desc' }],
      include: {
        unit: {
          include: {
            course: true
          }
        }
      }
    });

    return {
      data: snapshots.map((snapshot) => ({
        id: snapshot.id,
        unit: snapshot.unit
          ? {
              id: snapshot.unit.id,
              slug: snapshot.unit.slug,
              title: snapshot.unit.title,
              course: { id: snapshot.unit.course.id, slug: snapshot.unit.course.slug, title: snapshot.unit.course.title }
            }
          : null,
        completedCount: snapshot.completedCount,
        attemptedCount: snapshot.attemptedCount,
        correctCount: snapshot.correctCount,
        lastStudiedAt: snapshot.lastStudiedAt,
        updatedAt: snapshot.updatedAt
      }))
    };
  }

  @Get('review-items')
  async getReviewItems(@Headers('x-user-email') emailHeader: string | string[] | undefined) {
    const user = await requireUserByEmail(emailHeader);
    const [reviewItems, bookmarks] = await Promise.all([
      prisma.reviewItem.findMany({
        where: { userId: user.id },
        orderBy: [{ dueAt: 'asc' }, { updatedAt: 'desc' }],
        include: {
          question: {
            include: {
              unit: true
            }
          }
        }
      }),
      prisma.bookmark.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          question: {
            include: {
              unit: true
            }
          }
        }
      })
    ]);

    const reviewRows = reviewItems.map((item) => ({
      id: item.id,
      sourceType: 'review_item',
      bookmarkId: null,
      reason: item.reason,
      dueAt: item.dueAt,
      question: {
        id: item.question.id,
        slug: item.question.slug,
        title: item.question.title,
        difficulty: item.question.difficulty,
        unit: { id: item.question.unit.id, slug: item.question.unit.slug, title: item.question.unit.title }
      },
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    const bookmarkRows = bookmarks.map((item) => ({
      id: `bookmark-${item.id}`,
      sourceType: 'bookmark',
      bookmarkId: item.id,
      reason: 'bookmark',
      dueAt: null,
      question: {
        id: item.question.id,
        slug: item.question.slug,
        title: item.question.title,
        difficulty: item.question.difficulty,
        unit: { id: item.question.unit.id, slug: item.question.unit.slug, title: item.question.unit.title }
      },
      createdAt: item.createdAt,
      updatedAt: item.createdAt
    }));

    return {
      data: [...reviewRows, ...bookmarkRows].sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime())
    };
  }

  @Post('bookmarks')
  async addBookmark(@Headers('x-user-email') emailHeader: string | string[] | undefined, @Body() body: BookmarkBody) {
    if (!body.questionId) {
      throw new BadRequestException({ error: { code: 'QUESTION_REQUIRED', message: '見直しに追加する問題IDを指定してください。' } });
    }

    const user = await requireUserByEmail(emailHeader);
    const question = await prisma.question.findFirst({
      where: { OR: [{ id: body.questionId }, { slug: body.questionId }], status: 'PUBLISHED' }
    });

    if (!question) {
      throw new NotFoundException({ error: { code: 'QUESTION_NOT_FOUND', message: '指定された問題が見つかりません。' } });
    }

    const bookmark = await prisma.bookmark.upsert({
      where: { userId_questionId: { userId: user.id, questionId: question.id } },
      update: {},
      create: { userId: user.id, questionId: question.id },
      include: {
        question: {
          include: { unit: true }
        }
      }
    });

    return {
      data: {
        id: bookmark.id,
        question: {
          id: bookmark.question.id,
          slug: bookmark.question.slug,
          title: bookmark.question.title,
          unit: { id: bookmark.question.unit.id, slug: bookmark.question.unit.slug, title: bookmark.question.unit.title }
        },
        createdAt: bookmark.createdAt
      }
    };
  }

  @Delete('bookmarks/:bookmarkId')
  async removeBookmark(@Headers('x-user-email') emailHeader: string | string[] | undefined, @Param('bookmarkId') bookmarkId: string) {
    const user = await requireUserByEmail(emailHeader);
    const result = await prisma.bookmark.deleteMany({ where: { id: bookmarkId, userId: user.id } });

    if (result.count === 0) {
      throw new NotFoundException({ error: { code: 'BOOKMARK_NOT_FOUND', message: '指定された見直し項目が見つかりません。' } });
    }

    return { data: { id: bookmarkId, deleted: true } };
  }

  @Get('entitlements')
  async getEntitlements(@Headers('x-user-email') emailHeader: string | string[] | undefined) {
    const user = await requireUserByEmail(emailHeader);
    const now = new Date();
    const [subscriptions, entitlements] = await Promise.all([
      prisma.subscription.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
        include: { plan: true }
      }),
      prisma.entitlement.findMany({
        where: {
          userId: user.id,
          startsAt: { lte: now },
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
        },
        orderBy: { updatedAt: 'desc' },
        include: {
          plan: true,
          lab: true,
          certification: true,
          course: true,
          unit: true
        }
      })
    ]);

    return {
      data: {
        user: { id: user.id, email: user.email, accessLevel: user.accessLevel },
        subscriptions: subscriptions.map((subscription) => ({
          id: subscription.id,
          status: subscription.status,
          plan: {
            id: subscription.plan.id,
            slug: subscription.plan.slug,
            name: subscription.plan.name,
            accessLevel: subscription.plan.accessLevel
          },
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
        })),
        entitlements: entitlements.map((entitlement) => ({
          id: entitlement.id,
          scope: entitlement.scope,
          accessLevel: entitlement.accessLevel,
          startsAt: entitlement.startsAt,
          expiresAt: entitlement.expiresAt,
          plan: entitlement.plan ? { id: entitlement.plan.id, slug: entitlement.plan.slug, name: entitlement.plan.name } : null,
          lab: entitlement.lab ? { id: entitlement.lab.id, slug: entitlement.lab.slug, nameJa: entitlement.lab.nameJa } : null,
          certification: entitlement.certification
            ? { id: entitlement.certification.id, slug: entitlement.certification.slug, displayName: entitlement.certification.displayName }
            : null,
          course: entitlement.course ? { id: entitlement.course.id, slug: entitlement.course.slug, title: entitlement.course.title } : null,
          unit: entitlement.unit ? { id: entitlement.unit.id, slug: entitlement.unit.slug, title: entitlement.unit.title } : null
        }))
      }
    };
  }
}
