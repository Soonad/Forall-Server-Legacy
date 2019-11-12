import { Module } from "@nestjs/common";
import { FileStoreService, MemFileStore } from "./file-store.service";

@Module({
  providers: [
    {
      provide: FileStoreService,
      useClass: MemFileStore,
    },
  ],
  exports: [FileStoreService],
})
export class FileStoreModule {}
