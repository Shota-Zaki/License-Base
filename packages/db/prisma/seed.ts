import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const currentDir = dirname(fileURLToPath(import.meta.url));

type SeedChoice = {
  label: string;
  body: string;
  isCorrect: boolean;
};

type SeedQuestion = {
  slug: string;
  unitSlug: string;
  unitTitle: string;
  title: string;
  body: string;
  difficulty: number;
  choices: SeedChoice[];
  explanation: string;
  source: {
    sourceType: string;
    sourceName: string | null;
    sourceUrl: string | null;
    licenseNote: string | null;
    verificationStatus: string;
  };
  runtime?: {
    importGate?: string;
    sourceBucket?: string;
    visualPolicy?: string;
  };
};

const feMvpQuestions = JSON.parse(
  readFileSync(join(currentDir, 'seed-data', 'fe-mvp-questions.json'), 'utf-8')
) as SeedQuestion[];

async function main() {
  const lab = await prisma.lab.upsert({
    where: { slug: 'engineer-license-lab' },
    update: {
      nameEn: 'Engineer-License-Lab',
      nameJa: 'エンジニアライセンスラボ',
      description: 'システムエンジニア向けの資格学習領域です。',
      sortOrder: 1,
      isActive: true
    },
    create: {
      slug: 'engineer-license-lab',
      nameEn: 'Engineer-License-Lab',
      nameJa: 'エンジニアライセンスラボ',
      description: 'システムエンジニア向けの資格学習領域です。',
      sortOrder: 1
    }
  });

  const certification = await prisma.certification.upsert({
    where: { slug: 'fe' },
    update: {
      labId: lab.id,
      name: 'FE',
      displayName: 'FE Practice Lab',
      description: '基本情報技術者試験向けの演習・解説・進捗管理です。'
    },
    create: {
      labId: lab.id,
      slug: 'fe',
      name: 'FE',
      displayName: 'FE Practice Lab',
      description: '基本情報技術者試験向けの演習・解説・進捗管理です。'
    }
  });

  const course = await prisma.course.upsert({
    where: { slug: 'fe-practice-lab' },
    update: {
      certificationId: certification.id,
      title: 'FE Practice Lab',
      description: '科目A・科目Bを中心に基礎から演習まで学習します。',
      sortOrder: 1,
      isActive: true
    },
    create: {
      certificationId: certification.id,
      slug: 'fe-practice-lab',
      title: 'FE Practice Lab',
      description: '科目A・科目Bを中心に基礎から演習まで学習します。',
      sortOrder: 1
    }
  });

  const unitCache = new Map<string, { id: string }>();
  const seededQuestions: { id: string }[] = [];

  for (const [unitIndex, seedQuestion] of feMvpQuestions.entries()) {
    let unit = unitCache.get(seedQuestion.unitSlug);
    if (!unit) {
      unit = await prisma.unit.upsert({
        where: { slug: seedQuestion.unitSlug },
        update: {
          courseId: course.id,
          title: seedQuestion.unitTitle,
          sortOrder: unitIndex + 1,
          isPublished: true
        },
        create: {
          courseId: course.id,
          slug: seedQuestion.unitSlug,
          title: seedQuestion.unitTitle,
          sortOrder: unitIndex + 1,
          isPublished: true
        },
        select: { id: true }
      });
      unitCache.set(seedQuestion.unitSlug, unit);
    }

    const question = await prisma.question.upsert({
      where: { slug: seedQuestion.slug },
      update: {
        certificationId: certification.id,
        unitId: unit.id,
        status: 'PUBLISHED',
        accessLevel: 'FREE',
        title: seedQuestion.title,
        body: seedQuestion.body,
        difficulty: seedQuestion.difficulty,
        isFree: true,
        publishedAt: new Date()
      },
      create: {
        certificationId: certification.id,
        unitId: unit.id,
        slug: seedQuestion.slug,
        status: 'PUBLISHED',
        accessLevel: 'FREE',
        title: seedQuestion.title,
        body: seedQuestion.body,
        difficulty: seedQuestion.difficulty,
        isFree: true,
        publishedAt: new Date()
      },
      select: { id: true }
    });

    await prisma.questionChoice.deleteMany({ where: { questionId: question.id } });
    await prisma.questionChoice.createMany({
      data: seedQuestion.choices.map((choice, index) => ({
        questionId: question.id,
        label: choice.label,
        body: choice.body,
        isCorrect: choice.isCorrect,
        sortOrder: index + 1
      }))
    });

    await prisma.questionExplanation.upsert({
      where: { questionId: question.id },
      update: { bodyMd: seedQuestion.explanation },
      create: { questionId: question.id, bodyMd: seedQuestion.explanation }
    });

    await prisma.questionSource.deleteMany({ where: { questionId: question.id } });
    await prisma.questionSource.create({
      data: {
        questionId: question.id,
        sourceType: seedQuestion.source.sourceType,
        sourceName: seedQuestion.source.sourceName,
        sourceUrl: seedQuestion.source.sourceUrl,
        licenseNote: [
          seedQuestion.source.licenseNote,
          seedQuestion.runtime?.importGate ? `importGate=${seedQuestion.runtime.importGate}` : null,
          seedQuestion.runtime?.visualPolicy ? `visualPolicy=${seedQuestion.runtime.visualPolicy}` : null
        ].filter(Boolean).join(' / '),
        verificationStatus: seedQuestion.source.verificationStatus
      }
    });

    seededQuestions.push(question);
  }

  const sampleSet = await prisma.practiceSet.upsert({
    where: { slug: 'fe-free-sample-set' },
    update: {
      courseId: course.id,
      title: 'FE無料サンプル演習',
      description: '添付データの公式確認済み問題から構成したMVPサンプルです。',
      accessLevel: 'FREE',
      isFree: true,
      isPublished: true
    },
    create: {
      courseId: course.id,
      slug: 'fe-free-sample-set',
      title: 'FE無料サンプル演習',
      description: '添付データの公式確認済み問題から構成したMVPサンプルです。',
      accessLevel: 'FREE',
      isFree: true,
      isPublished: true
    },
    select: { id: true }
  });

  await prisma.practiceSetQuestion.deleteMany({ where: { practiceSetId: sampleSet.id } });
  await prisma.practiceSetQuestion.createMany({
    data: seededQuestions.map((question, index) => ({
      practiceSetId: sampleSet.id,
      questionId: question.id,
      sortOrder: index + 1
    }))
  });

  await prisma.plan.upsert({
    where: { slug: 'free' },
    update: {
      name: 'Free',
      accessLevel: 'FREE',
      priceMonthlyJpy: 0,
      description: '公開ページと一部の無料問題を利用できます。',
      isActive: true
    },
    create: {
      slug: 'free',
      name: 'Free',
      accessLevel: 'FREE',
      priceMonthlyJpy: 0,
      description: '公開ページと一部の無料問題を利用できます。'
    }
  });

  await prisma.plan.upsert({
    where: { slug: 'basic' },
    update: {
      name: 'Basic',
      accessLevel: 'BASIC',
      priceMonthlyJpy: null,
      description: '進捗保存、復習、見直し、全問題利用の土台です。価格は未確定です。',
      isActive: true
    },
    create: {
      slug: 'basic',
      name: 'Basic',
      accessLevel: 'BASIC',
      priceMonthlyJpy: null,
      description: '進捗保存、復習、見直し、全問題利用の土台です。価格は未確定です。'
    }
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
