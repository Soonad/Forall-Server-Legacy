import { Test, TestingModule } from "@nestjs/testing";
import * as fs from "fs";
import { ConfigService } from "nestjs-config";
import { promisify } from "util";
import { FileSystemFileStoreService } from "./file-system-file-store.service";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

describe("FileSystemFileStoreService", () => {
  let service: FileSystemFileStoreService;
  const basePath: string = "./data/files/test";
  let fileName: string;

  beforeAll(async () => {
    await mkdir(basePath, { recursive: true });
  });

  beforeEach(async () => {
    fileName = Math.random()
      .toString(36)
      .substring(2);

    const config = {
      "file-store.fsStoreBasePath": basePath,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileSystemFileStoreService,
        {
          provide: ConfigService,
          useValue: {
            get: (key) => config[key],
          },
        },
      ],
    }).compile();

    service = module.get<FileSystemFileStoreService>(
      FileSystemFileStoreService,
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  test("it should save a file to the file system", async () => {
    await service.persist(fileName, "content");
    expect(
      await readFile(`${basePath}/${fileName}`, { encoding: "utf-8" }),
    ).toEqual("content");
  });

  test("it should retrieve a file from the file system", async () => {
    await writeFile(`${basePath}/${fileName}`, "content", {
      encoding: "utf-8",
    });
    expect(await service.retrieve(fileName)).toEqual("content");
  });

  test("it should create nested directories", async () => {
    await service.persist(`${fileName}/${fileName}`, "content");
    expect(await exists(`${basePath}/${fileName}/${fileName}`)).toBe(true);
  });

  test("it should forbid writing to directories with navigation", async () => {
    await expect(
      service.persist(`a/b/../${fileName}`, "content"),
    ).rejects.toThrow();

    expect(await exists(`${basePath}/a/${fileName}`)).toBe(false);
  });
});
