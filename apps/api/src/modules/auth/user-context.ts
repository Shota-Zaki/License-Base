import { UnauthorizedException } from '@nestjs/common';
import { prisma } from '@license-base/db';

export function readUserEmail(emailHeader: string | string[] | undefined): string {
  const rawValue = Array.isArray(emailHeader) ? emailHeader[0] : emailHeader;
  const email = rawValue?.trim().toLowerCase();

  if (!email || !email.includes('@')) {
    throw new UnauthorizedException({
      error: {
        code: 'LOGIN_REQUIRED',
        message: '進捗保存・見直し・権限確認にはログインが必要です。MVPでは x-user-email ヘッダーでユーザーを識別します。'
      }
    });
  }

  return email;
}

export async function requireUserByEmail(emailHeader: string | string[] | undefined) {
  const email = readUserEmail(emailHeader);

  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      profile: {
        create: { timezone: 'Asia/Tokyo' }
      }
    },
    select: {
      id: true,
      email: true,
      accessLevel: true
    }
  });
}
