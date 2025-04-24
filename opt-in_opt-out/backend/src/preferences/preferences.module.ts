import { Module } from '@nestjs/common';
import { PreferenceService } from './preferences.service';
import { PreferenceController } from './preferences.controller';

@Module({
  controllers: [PreferenceController],
  providers: [PreferenceService],
})
export class PreferencesModule {}
