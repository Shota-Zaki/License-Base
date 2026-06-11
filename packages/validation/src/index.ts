import { z } from 'zod';

export const createAttemptSchema = z.object({
  practiceSetId: z.string().cuid().optional()
});

export const submitAnswerSchema = z.object({
  questionId: z.string().cuid(),
  selectedChoiceId: z.string().cuid()
});

export const createQuestionSchema = z.object({
  certificationId: z.string().cuid(),
  unitId: z.string().cuid(),
  title: z.string().min(1).max(120).optional(),
  body: z.string().min(1),
  isFree: z.boolean().default(false),
  choices: z.array(
    z.object({
      label: z.string().min(1).max(8),
      body: z.string().min(1),
      isCorrect: z.boolean().default(false),
      sortOrder: z.number().int().nonnegative()
    })
  ).min(2)
});
