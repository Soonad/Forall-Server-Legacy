import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as Bull from "bull";
import { getQueueToken } from "nest-bull";
import { v4 as genUUID } from "node-uuid";
import { Repository } from "typeorm";
import { FileStoreService } from "../file-store/file-store.service";
import { InMemoryFileStoreService } from "../file-store/in-memory-file-store/in-memory-file-store.service";
import { FormalityService } from "../formality/formality.service";
import { PUBLISH_JOB, UPLOADS_QUEUE } from "./uploads.constants";
import { Upload } from "./uploads.model";
import { UploadsProcessor } from "./uploads.processor";

describe("UploadsQueue", () => {
  let processor: UploadsProcessor;
  let store: InMemoryFileStoreService;
  let repo: Repository<Upload>;
  let formality: FormalityService;
  let queue: Bull.Queue;

  let upload: Upload;
  let code: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadsProcessor,
        {
          provide: FileStoreService,
          useClass: InMemoryFileStoreService,
        },
        {
          provide: getRepositoryToken(Upload),
          useClass: Repository,
        },
        {
          provide: getQueueToken(UPLOADS_QUEUE),
          useClass: Bull,
        },
        FormalityService,
      ],
    }).compile();

    processor = module.get(UploadsProcessor);
    repo = module.get(getRepositoryToken(Upload));
    queue = module.get(getQueueToken(UPLOADS_QUEUE));
    store = module.get(FileStoreService);
    formality = module.get(FormalityService);

    upload = new Upload();
    upload.id = genUUID();
    upload.name = "MyMod";

    code = "w : Word 7";
  });

  it("should be defined", () => {
    expect(processor).toBeDefined();
  });

  describe("processCheck", () => {
    beforeEach(async () => {
      jest.spyOn(repo, "findOneOrFail").mockResolvedValue(upload);
      jest.spyOn(store, "retrieve").mockResolvedValue(code);
      jest.spyOn(formality, "typechecks").mockResolvedValue(true);
      jest.spyOn(queue, "add").mockResolvedValue({} as any);
    });

    it("fetch, typecheck and schedule a job", async () => {
      await processor.processCheck({ data: { id: upload.id } } as any);
      expect(jest.spyOn(repo, "findOneOrFail")).toBeCalledWith(upload.id);
      expect(jest.spyOn(store, "retrieve")).toBeCalledWith(upload.fileStoreKey);
      expect(jest.spyOn(formality, "typechecks")).toBeCalledWith(code);
      expect(jest.spyOn(queue, "add")).toBeCalledWith(PUBLISH_JOB, {
        id: upload.id,
      });
    });

    it("should not schedule a job if it doesn't typecheck", async () => {
      jest.spyOn(formality, "typechecks").mockResolvedValueOnce(false);
      await processor.processCheck({ data: { id: upload.id } } as any);
      expect(jest.spyOn(queue, "add")).toBeCalledTimes(0);
    });
  });
});
