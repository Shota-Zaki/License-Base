const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/v1';

type ApiEnvelope<T> = { data: T };

export type CourseUnit = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sortOrder: number;
  questionCount: number;
};

export type CoursePracticeSet = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  accessLevel: string;
  isFree: boolean;
  questionCount: number;
};

export type CourseDetail = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  lab: { slug: string; nameEn: string; nameJa: string };
  certification: { slug: string; name: string; displayName: string };
  units: CourseUnit[];
  practiceSets: CoursePracticeSet[];
};

export type PracticeQuestion = {
  id: string;
  slug: string;
  sortOrder: number;
  title: string | null;
  body: string;
  difficulty: number;
  isFree: boolean;
  accessLevel: string;
  unit: { slug: string; title: string };
  choices: Array<{ id: string; label: string; body: string }>;
  sources: Array<{ sourceType: string; sourceName: string | null; sourceUrl: string | null; licenseNote: string | null; verificationStatus: string }>;
};

export type PracticeSetDetail = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  accessLevel: string;
  isFree: boolean;
  course: { slug: string; title: string };
  questions: PracticeQuestion[];
};

export const fallbackCourse: CourseDetail = {
  id: 'fallback-fe-practice-lab',
  slug: 'fe-practice-lab',
  title: 'FE Practice Lab',
  description: '科目A・科目Bを中心に基礎から演習まで学習します。',
  lab: { slug: 'engineer-license-lab', nameEn: 'Engineer-License-Lab', nameJa: 'エンジニアライセンスラボ' },
  certification: { slug: 'fe', name: 'FE', displayName: 'FE Practice Lab' },
  units: [
    { id: 'fallback-fe-subject-a', slug: 'fe-subject-a', title: '科目A', description: '知識問題を短時間で反復します。', sortOrder: 1, questionCount: 0 },
    { id: 'fallback-fe-subject-b', slug: 'fe-subject-b', title: '科目B', description: 'アルゴリズムと読解型問題を扱います。', sortOrder: 2, questionCount: 0 },
    { id: 'fallback-fe-technology', slug: 'fe-technology', title: 'テクノロジ系', description: '基礎理論と技術要素を扱います。', sortOrder: 3, questionCount: 1 },
    { id: 'fallback-fe-database', slug: 'fe-database', title: 'データベース', description: '正規化とSQLの基礎を扱います。', sortOrder: 8, questionCount: 0 }
  ],
  practiceSets: [
    { id: 'fallback-fe-free-sample-set', slug: 'fe-free-sample-set', title: 'FE無料サンプル演習', description: 'ゲストでも確認できる最小サンプルです。', accessLevel: 'FREE', isFree: true, questionCount: 1 }
  ]
};

export const fallbackPracticeSet: PracticeSetDetail = {
  id: 'fallback-fe-free-sample-set',
  slug: 'fe-free-sample-set',
  title: 'FE無料サンプル演習',
  description: 'ゲストでも確認できる最小サンプルです。',
  accessLevel: 'FREE',
  isFree: true,
  course: { slug: 'fe-practice-lab', title: 'FE Practice Lab' },
  questions: [
    {
      id: 'fallback-fe-binary-conversion-001',
      slug: 'fe-binary-conversion-001',
      sortOrder: 1,
      title: 'サンプル問題: 2進数',
      body: '10進数の13を2進数で表したものとして、適切なものはどれか。',
      difficulty: 1,
      isFree: true,
      accessLevel: 'FREE',
      unit: { slug: 'fe-technology', title: 'テクノロジ系' },
      choices: [
        { id: 'fallback-a', label: 'ア', body: '1011' },
        { id: 'fallback-b', label: 'イ', body: '1101' },
        { id: 'fallback-c', label: 'ウ', body: '1110' },
        { id: 'fallback-d', label: 'エ', body: '1001' }
      ],
      sources: [{ sourceType: 'original', sourceName: 'fallback', sourceUrl: null, licenseNote: 'MVP用の自作サンプル問題です。', verificationStatus: 'original' }]
    }
  ]
};

async function readApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
}

export async function getCourseDetail(courseSlug: string): Promise<CourseDetail> {
  try {
    return await readApi<CourseDetail>(`/courses/${courseSlug}`);
  } catch {
    return fallbackCourse;
  }
}

export async function getPracticeSetDetail(practiceSetId: string): Promise<PracticeSetDetail> {
  try {
    return await readApi<PracticeSetDetail>(`/practice-sets/${practiceSetId}`);
  } catch {
    return fallbackPracticeSet;
  }
}
