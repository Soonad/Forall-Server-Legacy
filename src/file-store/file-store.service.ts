import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class FileStoreService {
  public abstract async persist(name: string, content: string): Promise<void>;
  public abstract async retrieve(name: string): Promise<string | null>;
}
