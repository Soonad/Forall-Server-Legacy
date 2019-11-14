import { Test, TestingModule } from "@nestjs/testing";
import { FormalityService } from "./formality.service";

describe("FormalityService", () => {
  let service: FormalityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormalityService],
    }).compile();

    service = module.get<FormalityService>(FormalityService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
