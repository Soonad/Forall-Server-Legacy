import { Module } from "@nestjs/common";
import { CodesModule } from "./codes/codes.module";
import { ModulesModule } from "./modules/modules.module";
import { UploadsModule } from "./uploads/uploads.module";

@Module({
  imports: [UploadsModule, ModulesModule, CodesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
