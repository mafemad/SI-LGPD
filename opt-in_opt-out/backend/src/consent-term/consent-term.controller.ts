import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ConsentTermService } from './consent-term.service';

@Controller('terms')
export class ConsentTermController {
  constructor(private readonly service: ConsentTermService) {}

  @Post()
  create(
    @Body()
    body: {
      content: string;
      preferenceIds: string[];
      newPreferences?: { name: string; description?: string }[];
    },
  ) {
    return this.service.create(body.content, body.preferenceIds, body.newPreferences || []);
  }
  @Get()
  getTerms(@Query('active') active?: string) {
    const isActive = active !== undefined ? active === 'true' : undefined;
    return this.service.getTerms(isActive);
  }

  @Post('accept')
  acceptTerm(
    @Body() body: { userId: string; termId: string },
  ) {
    return this.service.acceptTerm(body.userId, body.termId);
  }

}
