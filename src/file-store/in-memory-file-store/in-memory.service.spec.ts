import { Test, TestingModule } from "@nestjs/testing";
import { InMemoryFileStoreService } from "./in-memory-file-store.service";

describe("InMemoryFileStoreService", () => {
  let service: InMemoryFileStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InMemoryFileStoreService],
    }).compile();

    service = module.get<InMemoryFileStoreService>(InMemoryFileStoreService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
