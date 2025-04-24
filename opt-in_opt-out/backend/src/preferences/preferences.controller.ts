import { Controller, Put, Param, Body } from '@nestjs/common';
import { PreferenceService } from './preferences.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Controller('preferences')
export class PreferenceController {
  constructor(private readonly prefService: PreferenceService) {}

  @Put(':userId')
  update(@Param('userId') userId: string, @Body() dto: UpdatePreferenceDto) {
    return this.prefService.updatePreferences(userId, dto);
  }
}
