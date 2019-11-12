import { Test, TestingModule } from "@nestjs/testing";
import {
  FileStoreService,
  MemFileStore,
} from "../file-store/file-store.service";
import { UploadsController } from "./uploads.controller";
import { ICreateUploadRequest, UploadsService } from "./uploads.service";

describe("Uploads Controller", () => {
  let controller: UploadsController;
  let memStore: MemFileStore;

  beforeEach(async () => {
    memStore = new MemFileStore();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadsController],
      providers: [
        {
          provide: UploadsService,
          useValue: {},
        },
        {
          provide: FileStoreService,
          useValue: memStore,
        },
      ],
    }).compile();

    controller = module.get<UploadsController>(UploadsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
