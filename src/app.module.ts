import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "nestjs-config";
import * as path from "path";
import { CodesModule } from "./codes/codes.module";
import { FormalityModule } from "./formality/formality.module";
import { ModulesModule } from "./modules/modules.module";
import { Upload } from "./uploads/uploads.model";
import { UploadsModule } from "./uploads/uploads.module";

@Module({
  imports: [
    UploadsModule,
    ModulesModule,
    CodesModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        url: config.get("database.url"),
        synchronize: true, // We need to change to false once we are in production.
        entities: [Upload],
        keepConnectionAlive: config.get("database.keepConnectionAlive"),
      }),
    }),
    ConfigModule.load(path.resolve(__dirname, "config", "**/!(*.d).{ts,js}")),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
