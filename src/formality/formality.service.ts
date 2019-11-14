import { Injectable } from "@nestjs/common";

@Injectable()
export class FormalityService {
  public async typechecks(code: string): Promise<boolean> {
    // TODO: Implement it properly
    return true;
  }
}
