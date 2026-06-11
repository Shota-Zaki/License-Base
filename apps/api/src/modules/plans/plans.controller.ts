import { Controller, Get } from '@nestjs/common';
import { prisma } from '@license-base/db';

@Controller('plans')
export class PlansController {
  @Get()
  async listPlans() {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    return {
      data: plans.map((plan) => ({
        id: plan.id,
        slug: plan.slug,
        name: plan.name,
        accessLevel: plan.accessLevel,
        priceMonthlyJpy: plan.priceMonthlyJpy,
        description: plan.description,
        isActive: plan.isActive
      }))
    };
  }
}
