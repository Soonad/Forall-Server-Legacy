import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { v4 as genUUID } from "node-uuid";
import { DeepPartial, EntityRepository, Repository } from "typeorm";
import {
  FileStoreService,
  MemFileStore,
} from "../file-store/file-store.service";
import { Upload } from "./uploads.model";
import { ICreateUploadRequest, UploadsService } from "./uploads.service";

describe("UploadsService", () => {
  let service: UploadsService;
  let memStore: MemFileStore;
  let repo: Repository<Upload>;
  let upload: Upload;

  beforeEach(async () => {
    memStore = new MemFileStore();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadsService,
        {
          provide: FileStoreService,
          useValue: memStore,
        },
        {
          provide: getRepositoryToken(Upload),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
    repo = module.get<Repository<Upload>>(getRepositoryToken(Upload));
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
        code: `w : Word 1`,
        name: "MyMod",
      };

      jest.spyOn(repo, "create").mockReturnValue(upload);
      jest.spyOn(repo, "save").mockResolvedValue(upload);
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
  });

  describe("getProcessedUpload", () => {
    let findOneSpy: jest.SpyInstance<Promise<Upload | undefined>, any>;

    beforeEach(async () => {
      findOneSpy = jest.spyOn(repo, "findOne").mockResolvedValue(undefined);
    });

    it("should just pass the id to repository", async () => {
      await service.getProcessedUpload(upload.id);
      expect(findOneSpy.mock.calls[0][0]).toEqual(upload.id);
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
