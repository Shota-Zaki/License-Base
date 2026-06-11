import { Controller, Get } from '@nestjs/common';

@Controller('questions')
export class QuestionsController {
  @Get('sample')
  getSampleQuestion() {
    return {
      data: {
        id: 'sample-binary-001',
        title: 'サンプル問題: 2進数',
        body: '10進数の13を2進数で表したものとして、適切なものはどれか。',
        choices: [
          { id: 'a', label: 'ア', body: '1011' },
          { id: 'b', label: 'イ', body: '1101' },
          { id: 'c', label: 'ウ', body: '1110' },
          { id: 'd', label: 'エ', body: '1001' }
        ],
        isFree: true
      }
    };
  }
}
