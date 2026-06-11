import { Controller, Get } from '@nestjs/common';

@Controller('labs')
export class LabsController {
  @Get()
  listLabs() {
    return {
      data: [
        {
          slug: 'engineer-license-lab',
          nameEn: 'Engineer-License-Lab',
          nameJa: 'エンジニアライセンスラボ',
          description: 'システムエンジニア向けの資格学習領域です。'
        }
      ]
    };
  }
}
