import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lab = await prisma.lab.upsert({
    where: { slug: 'engineer-license-lab' },
    update: {},
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
    update: {},
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
    update: {},
    create: {
      certificationId: certification.id,
      slug: 'fe-practice-lab',
      title: 'FE Practice Lab',
      description: '科目A・科目Bを中心に基礎から演習まで学習します。'
    }
  });

  const unit = await prisma.unit.upsert({
    where: { slug: 'fe-technology' },
    update: {},
    create: {
      courseId: course.id,
      slug: 'fe-technology',
      title: 'テクノロジ系',
      sortOrder: 1
    }
  });

  let question = await prisma.question.findFirst({
    where: { title: 'サンプル問題: 2進数' }
  });

  if (!question) {
    question = await prisma.question.create({
      data: {
        certificationId: certification.id,
        unitId: unit.id,
        status: 'PUBLISHED',
        title: 'サンプル問題: 2進数',
        body: '10進数の13を2進数で表したものとして、適切なものはどれか。',
        isFree: true,
        choices: {
          create: [
            { label: 'ア', body: '1011', isCorrect: false, sortOrder: 1 },
            { label: 'イ', body: '1101', isCorrect: true, sortOrder: 2 },
            { label: 'ウ', body: '1110', isCorrect: false, sortOrder: 3 },
            { label: 'エ', body: '1001', isCorrect: false, sortOrder: 4 }
          ]
        },
        explanation: {
          create: {
            bodyMd: '13は8 + 4 + 1なので、2進数では1101です。'
          }
        },
        sources: {
          create: {
            sourceType: 'original',
            sourceName: 'initial-seed',
            verificationStatus: 'original'
          }
        }
      }
    });
  }

  await prisma.practiceSet.upsert({
    where: { slug: 'fe-free-sample-set' },
    update: {},
    create: {
      courseId: course.id,
      slug: 'fe-free-sample-set',
      title: 'FE無料サンプル演習',
      description: 'ゲストでも確認できる最小サンプルです。',
      isFree: true,
      isPublished: true,
      questions: {
        create: { questionId: question.id, sortOrder: 1 }
      }
    }
  });

  await prisma.plan.upsert({
    where: { slug: 'free' },
    update: {},
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
    update: {},
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
