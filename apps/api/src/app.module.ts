import { Module } from '@nestjs/common';
import { HealthController } from './modules/health/health.controller.js';
import { LabsController } from './modules/labs/labs.controller.js';
import { CoursesController } from './modules/courses/courses.controller.js';
import { QuestionsController } from './modules/questions/questions.controller.js';
import { PracticeSetsController } from './modules/practice-sets/practice-sets.controller.js';
import { AttemptsController } from './modules/attempts/attempts.controller.js';
import { MeController } from './modules/me/me.controller.js';
import { PlansController } from './modules/plans/plans.controller.js';

const controllers = [
  HealthController,
  LabsController,
  CoursesController,
  QuestionsController,
  PracticeSetsController,
  AttemptsController,
  MeController,
  PlansController
];

@Module({
  imports: [],
  controllers,
  providers: []
})
export class AppModule {}
