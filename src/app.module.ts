import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CodesModule } from "./codes/codes.module";
import { ModulesModule } from "./modules/modules.module";
import { Upload } from "./uploads/uploads.model";
import { UploadsModule } from "./uploads/uploads.module";

@Module({
  imports: [
    UploadsModule,
    ModulesModule,
    CodesModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      url: "postgres://forall:forall@localhost:5432/forall-dev",
      synchronize: true,
      entities: [Upload],
      keepConnectionAlive: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
