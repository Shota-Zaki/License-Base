import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { prisma } from '@license-base/db';

@Controller('courses')
export class CoursesController {
  @Get(':courseSlug')
  async getCourse(@Param('courseSlug') courseSlug: string) {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        certification: {
          include: { lab: true }
        },
        units: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: {
              select: { questions: true }
            }
          }
        },
        practiceSets: {
          where: { isPublished: true },
          orderBy: { createdAt: 'asc' },
          include: {
            _count: {
              select: { questions: true }
            }
          }
        }
      }
    });

    if (!course) {
      throw new NotFoundException({
        error: {
          code: 'COURSE_NOT_FOUND',
          message: '指定されたコースが見つかりません。'
        }
      });
    }

    return {
      data: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        lab: {
          id: course.certification.lab.id,
          slug: course.certification.lab.slug,
          nameEn: course.certification.lab.nameEn,
          nameJa: course.certification.lab.nameJa
        },
        certification: {
          id: course.certification.id,
          slug: course.certification.slug,
          name: course.certification.name,
          displayName: course.certification.displayName
        },
        units: course.units.map((unit) => ({
          id: unit.id,
          slug: unit.slug,
          title: unit.title,
          description: unit.description,
          sortOrder: unit.sortOrder,
          questionCount: unit._count.questions
        })),
        practiceSets: course.practiceSets.map((practiceSet) => ({
          id: practiceSet.id,
          slug: practiceSet.slug,
          title: practiceSet.title,
          description: practiceSet.description,
          accessLevel: practiceSet.accessLevel,
          isFree: practiceSet.isFree,
          questionCount: practiceSet._count.questions
        }))
      }
    };
  }
}
