import { Test, TestingModule } from "@nestjs/testing";
import { FileStoreService } from "../file-store/file-store.service";
import { InMemoryFileStoreService } from "../file-store/in-memory-file-store/in-memory-file-store.service";
import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";

describe("Uploads Controller", () => {
  let controller: UploadsController;
  let memStore: InMemoryFileStoreService;

  beforeEach(async () => {
    memStore = new InMemoryFileStoreService();
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
