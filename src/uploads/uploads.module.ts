import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "nest-bull";
import { ConfigService } from "nestjs-config";

import { FileStoreModule } from "../file-store/file-store.module";
import { FormalityModule } from "../formality/formality.module";

import { UPLOADS_QUEUE } from "./uploads.constants";
import { UploadsController } from "./uploads.controller";
import { Upload } from "./uploads.model";
import { UploadsProcessor } from "./uploads.processor";
import { UploadsService } from "./uploads.service";

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, UploadsProcessor],
  imports: [
    FormalityModule,
    FileStoreModule,
    TypeOrmModule.forFeature([Upload]),
    BullModule.registerAsync({
      name: UPLOADS_QUEUE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        name: UPLOADS_QUEUE,
        options: {
          redis: config.get("redis.url"),
        },
        processors: [],
      }),
    }),
  ],
})
export class UploadsModule {}
