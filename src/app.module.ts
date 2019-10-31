import { Module } from '@nestjs/common';
import { UploadsModule } from './uploads/uploads.module';
import { ModulesModule } from './modules/modules.module';
import { CodesModule } from './codes/codes.module';

@Module({
  imports: [UploadsModule, ModulesModule, CodesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
