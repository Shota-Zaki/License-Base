export type LabSlug =
  | 'engineer-license-lab'
  | 'business-license-lab'
  | 'office-license-lab'
  | 'legal-license-lab'
  | 'money-license-lab'
  | 'life-license-lab';

export type CertificationSlug =
  | 'fe'
  | 'java'
  | 'db-sql'
  | 'security'
  | 'cloud'
  | 'linux'
  | 'career';

export type QuestionStatus = 'DRAFT' | 'REVIEWING' | 'PUBLISHED' | 'ARCHIVED';
export type AccessLevel = 'FREE' | 'BASIC' | 'PRO' | 'ADMIN';

export interface PublicQuestionChoice {
  id: string;
  label: string;
  body: string;
}

export interface PublicQuestion {
  id: string;
  title?: string | null;
  body: string;
  choices: PublicQuestionChoice[];
  isFree: boolean;
}
