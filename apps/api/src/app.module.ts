import { Module } from '@nestjs/common';
import { HealthController } from './modules/health/health.controller.js';
import { LabsController } from './modules/labs/labs.controller.js';
import { CoursesController } from './modules/courses/courses.controller.js';
import { QuestionsController } from './modules/questions/questions.controller.js';

@Module({
  imports: [],
  controllers: [HealthController, LabsController, CoursesController, QuestionsController],
  providers: []
})
export class AppModule {}
