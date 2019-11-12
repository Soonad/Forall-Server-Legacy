import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileStoreModule } from "../file-store/file-store.module";
import { UploadsController } from "./uploads.controller";
import { Upload } from "./uploads.model";
import { UploadsService } from "./uploads.service";

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
  imports: [FileStoreModule, TypeOrmModule.forFeature([Upload])],
})
export class UploadsModule {}
