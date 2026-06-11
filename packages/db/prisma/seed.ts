import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const unitSeeds = [
  { slug: 'fe-subject-a', title: '科目A', sortOrder: 1 },
  { slug: 'fe-subject-b', title: '科目B', sortOrder: 2 },
  { slug: 'fe-technology', title: 'テクノロジ系', sortOrder: 3 },
  { slug: 'fe-management', title: 'マネジメント系', sortOrder: 4 },
  { slug: 'fe-strategy', title: 'ストラテジ系', sortOrder: 5 },
  { slug: 'fe-security', title: '情報セキュリティ', sortOrder: 6 },
  { slug: 'fe-algorithm', title: 'アルゴリズム', sortOrder: 7 },
  { slug: 'fe-database', title: 'データベース', sortOrder: 8 }
];

const sampleQuestions = [
  {
    slug: 'fe-binary-conversion-001',
    title: 'サンプル問題: 2進数',
    body: '10進数の13を2進数で表したものとして、適切なものはどれか。',
    unitSlug: 'fe-technology',
    difficulty: 1,
    choices: [
      { label: 'ア', body: '1011', isCorrect: false },
      { label: 'イ', body: '1101', isCorrect: true },
      { label: 'ウ', body: '1110', isCorrect: false },
      { label: 'エ', body: '1001', isCorrect: false }
    ],
    explanation: '13は8 + 4 + 1で表せます。2進数では8の位、4の位、1の位が1になり、2の位は0になるため1101です。'
  }
];

async function main() {
  const lab = await prisma.lab.upsert({
    where: { slug: 'engineer-license-lab' },
    update: { nameEn: 'Engineer-License-Lab', nameJa: 'エンジニアライセンスラボ', description: 'システムエンジニア向けの資格学習領域です。', sortOrder: 1, isActive: true },
    create: { slug: 'engineer-license-lab', nameEn: 'Engineer-License-Lab', nameJa: 'エンジニアライセンスラボ', description: 'システムエンジニア向けの資格学習領域です。', sortOrder: 1 }
  });

  const certification = await prisma.certification.upsert({
    where: { slug: 'fe' },
    update: { labId: lab.id, name: 'FE', displayName: 'FE Practice Lab', description: '基本情報技術者試験向けの演習・解説・進捗管理です。' },
    create: { labId: lab.id, slug: 'fe', name: 'FE', displayName: 'FE Practice Lab', description: '基本情報技術者試験向けの演習・解説・進捗管理です。' }
  });

  const course = await prisma.course.upsert({
    where: { slug: 'fe-practice-lab' },
    update: { certificationId: certification.id, title: 'FE Practice Lab', description: '科目A・科目Bを中心に基礎から演習まで学習します。', sortOrder: 1, isActive: true },
    create: { certificationId: certification.id, slug: 'fe-practice-lab', title: 'FE Practice Lab', description: '科目A・科目Bを中心に基礎から演習まで学習します。', sortOrder: 1 }
  });

  const units = new Map<string, { id: string }>();
  for (const unitSeed of unitSeeds) {
    const unit = await prisma.unit.upsert({
      where: { slug: unitSeed.slug },
      update: { courseId: course.id, title: unitSeed.title, sortOrder: unitSeed.sortOrder, isPublished: true },
      create: { courseId: course.id, slug: unitSeed.slug, title: unitSeed.title, sortOrder: unitSeed.sortOrder, isPublished: true },
      select: { id: true, slug: true }
    });
    units.set(unit.slug, unit);
  }

  const seededQuestions: { id: string }[] = [];
  for (const sampleQuestion of sampleQuestions) {
    const unit = units.get(sampleQuestion.unitSlug) ?? units.get('fe-technology');
    if (!unit) continue;

    const question = await prisma.question.upsert({
      where: { slug: sampleQuestion.slug },
      update: { certificationId: certification.id, unitId: unit.id, status: 'PUBLISHED', accessLevel: 'FREE', title: sampleQuestion.title, body: sampleQuestion.body, difficulty: sampleQuestion.difficulty, isFree: true, publishedAt: new Date() },
      create: { certificationId: certification.id, unitId: unit.id, slug: sampleQuestion.slug, status: 'PUBLISHED', accessLevel: 'FREE', title: sampleQuestion.title, body: sampleQuestion.body, difficulty: sampleQuestion.difficulty, isFree: true, publishedAt: new Date() },
      select: { id: true }
    });

    await prisma.questionChoice.deleteMany({ where: { questionId: question.id } });
    await prisma.questionChoice.createMany({
      data: sampleQuestion.choices.map((choice, index) => ({ questionId: question.id, label: choice.label, body: choice.body, isCorrect: choice.isCorrect, sortOrder: index + 1 }))
    });
    await prisma.questionExplanation.upsert({
      where: { questionId: question.id },
      update: { bodyMd: sampleQuestion.explanation },
      create: { questionId: question.id, bodyMd: sampleQuestion.explanation }
    });
    await prisma.questionSource.deleteMany({ where: { questionId: question.id } });
    await prisma.questionSource.create({ data: { questionId: question.id, sourceType: 'original', sourceName: 'original-seed', licenseNote: 'MVP用の自作サンプル問題です。', verificationStatus: 'original' } });
    seededQuestions.push(question);
  }

  const sampleSet = await prisma.practiceSet.upsert({
    where: { slug: 'fe-free-sample-set' },
    update: { courseId: course.id, title: 'FE無料サンプル演習', description: 'ゲストでも確認できる最小サンプルです。', accessLevel: 'FREE', isFree: true, isPublished: true },
    create: { courseId: course.id, slug: 'fe-free-sample-set', title: 'FE無料サンプル演習', description: 'ゲストでも確認できる最小サンプルです。', accessLevel: 'FREE', isFree: true, isPublished: true },
    select: { id: true }
  });

  for (const [index, question] of seededQuestions.entries()) {
    await prisma.practiceSetQuestion.upsert({
      where: { practiceSetId_questionId: { practiceSetId: sampleSet.id, questionId: question.id } },
      update: { sortOrder: index + 1 },
      create: { practiceSetId: sampleSet.id, questionId: question.id, sortOrder: index + 1 }
    });
  }

  await prisma.plan.upsert({
    where: { slug: 'free' },
    update: { name: 'Free', accessLevel: 'FREE', priceMonthlyJpy: 0, description: '公開ページと一部の無料問題を利用できます。', isActive: true },
    create: { slug: 'free', name: 'Free', accessLevel: 'FREE', priceMonthlyJpy: 0, description: '公開ページと一部の無料問題を利用できます。' }
  });
  await prisma.plan.upsert({
    where: { slug: 'basic' },
    update: { name: 'Basic', accessLevel: 'BASIC', priceMonthlyJpy: null, description: '進捗保存、復習、見直し、全問題利用の土台です。価格は未確定です。', isActive: true },
    create: { slug: 'basic', name: 'Basic', accessLevel: 'BASIC', priceMonthlyJpy: null, description: '進捗保存、復習、見直し、全問題利用の土台です。価格は未確定です。' }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
