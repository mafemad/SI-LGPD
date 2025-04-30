import { Controller, Put, Param, Body, Post } from '@nestjs/common';
import { PreferenceService } from './preferences.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Controller('preferences')
export class PreferenceController {
  constructor(private readonly prefService: PreferenceService) {}

  @Put(':userId')
  update(@Param('userId') userId: string, @Body() dto: Record<string, boolean>) {
    return this.prefService.updatePreferences(userId, dto);
  }

  @Post('create')
  create(@Body() body: { name: string; description?: string }) {
    return this.prefService.createPreference(body.name, body.description);
  }

  @Post('delete')
  delete(@Body() body: { id: string }) {
    return this.prefService.deletePreference(body.id);
  }
}