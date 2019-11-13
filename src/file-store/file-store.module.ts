import { Module } from "@nestjs/common";
import { FileStoreService } from "./file-store.service";
import { FileSystemFileStoreService } from "./file-system-file-store/file-system-file-store.service";
import { InMemoryFileStoreService } from "./in-memory-file-store/in-memory-file-store.service";

const storeClassesByEnv = {
  test: InMemoryFileStoreService,
};

const storeClass =
  storeClassesByEnv[process.env.NODE_ENV] || FileSystemFileStoreService;

@Module({
  providers: [
    {
      provide: FileStoreService,
      useClass: storeClass,
    },
  ],
  exports: [FileStoreService],
})
export class FileStoreModule {}
