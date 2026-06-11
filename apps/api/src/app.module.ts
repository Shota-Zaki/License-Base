import { Module } from '@nestjs/common';
import { HealthController } from './modules/health/health.controller.js';
import { LabsController } from './modules/labs/labs.controller.js';
import { CoursesController } from './modules/courses/courses.controller.js';
import { QuestionsController } from './modules/questions/questions.controller.js';
import { PracticeSetsController } from './modules/practice-sets/practice-sets.controller.js';

@Module({
  imports: [],
  controllers: [HealthController, LabsController, CoursesController, QuestionsController, PracticeSetsController],
  providers: []
})
export class AppModule {}
