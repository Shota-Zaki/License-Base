import { Controller, Get, Param } from '@nestjs/common';

@Controller('courses')
export class CoursesController {
  @Get(':courseSlug')
  getCourse(@Param('courseSlug') courseSlug: string) {
    return {
      data: {
        slug: courseSlug,
        title: 'FE Practice Lab',
        description: '基本情報技術者試験向けの演習・解説・進捗管理です。',
        units: [
          { slug: 'fe-subject-a', title: '科目A' },
          { slug: 'fe-subject-b', title: '科目B' },
          { slug: 'fe-technology', title: 'テクノロジ系' },
          { slug: 'fe-security', title: '情報セキュリティ' },
          { slug: 'fe-algorithm', title: 'アルゴリズム' },
          { slug: 'fe-database', title: 'データベース' }
        ]
      }
    };
  }
}
