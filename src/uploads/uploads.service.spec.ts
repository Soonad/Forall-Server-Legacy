import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as Bull from "bull";
import { getQueueToken } from "nest-bull";
import { v4 as genUUID } from "node-uuid";
import { Repository } from "typeorm";
import { FileStoreService } from "../file-store/file-store.service";
import { InMemoryFileStoreService } from "../file-store/in-memory-file-store/in-memory-file-store.service";
import { CHECK_JOB, UPLOADS_QUEUE } from "./uploads.constants";
import { Upload } from "./uploads.model";
import { ICreateUploadRequest, UploadsService } from "./uploads.service";

describe("UploadsService", () => {
  let service: UploadsService;
  let memStore: InMemoryFileStoreService;
  let repo: Repository<Upload>;
  let upload: Upload;
  let queue: Bull.Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadsService,
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
      ],
    }).compile();

    service = module.get(UploadsService);
    repo = module.get(getRepositoryToken(Upload));
    queue = module.get(getQueueToken(UPLOADS_QUEUE));
    memStore = module.get(FileStoreService);

    upload = new Upload();
    upload.id = genUUID();
    upload.name = "MyMod";
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createUpload", () => {
    let req: ICreateUploadRequest;

    beforeEach(async () => {
      req = {
        code: "w : Word 1",
        name: "MyMod",
      };

      jest.spyOn(repo, "create").mockReturnValue(upload);
      jest.spyOn(repo, "save").mockResolvedValue(upload);
      jest.spyOn(queue, "add").mockResolvedValue({} as any);
    });

    it("should create upload on repository and return its id", async () => {
      expect(await service.createUpload(req)).toEqual(upload.id);
    });

    it("should save file on FileStore", async () => {
      await service.createUpload(req);

      const key = Object.keys(memStore.files).filter((aKey) =>
        aKey.match(/MyMod/),
      )[0];

      expect(key).toBeDefined();
      expect(memStore.files[key]).toEqual(req.code);
    });

    it("should add a job to process the upload", async () => {
      await service.createUpload(req);

      expect(jest.spyOn(queue, "add")).toBeCalledWith(CHECK_JOB, {
        id: upload.id,
      });
    });
  });

  describe("getProcessedUpload", () => {
    let findOneSpy: jest.SpyInstance<Promise<Upload | undefined>, any>;

    beforeEach(async () => {
      findOneSpy = jest.spyOn(repo, "findOne").mockResolvedValue(undefined);
    });

    it("should just pass the id to repository", async () => {
      await service.getProcessedUpload(upload.id);
      expect(findOneSpy).toBeCalledWith(upload.id);
    });

    it("should return null if no upload exist", async () => {
      expect(await service.getProcessedUpload(upload.id)).toBeNull();
    });

    it("should return null if upload exist but no version is assigned", async () => {
      findOneSpy.mockResolvedValueOnce(upload);
      expect(await service.getProcessedUpload(upload.id)).toBeNull();
    });

    it("should return the upload if it has version assigned", async () => {
      upload.version = "123";
      findOneSpy.mockResolvedValueOnce(upload);
      expect(await service.getProcessedUpload(upload.id)).toBe(upload);
    });
  });
});
