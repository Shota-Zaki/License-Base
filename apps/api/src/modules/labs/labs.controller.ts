import { Controller, Get } from '@nestjs/common';
import { prisma } from '@license-base/db';

@Controller('labs')
export class LabsController {
  @Get()
  async listLabs() {
    const labs = await prisma.lab.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        certifications: {
          orderBy: { createdAt: 'asc' },
          include: {
            courses: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' }
            }
          }
        }
      }
    });

    return {
      data: labs.map((lab) => ({
        id: lab.id,
        slug: lab.slug,
        nameEn: lab.nameEn,
        nameJa: lab.nameJa,
        description: lab.description,
        certifications: lab.certifications.map((certification) => ({
          id: certification.id,
          slug: certification.slug,
          name: certification.name,
          displayName: certification.displayName,
          description: certification.description,
          courses: certification.courses.map((course) => ({
            id: course.id,
            slug: course.slug,
            title: course.title,
            description: course.description
          }))
        }))
      }))
    };
  }
}
