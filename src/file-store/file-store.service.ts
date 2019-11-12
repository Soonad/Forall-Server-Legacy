import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class FileStoreService {
  public abstract async persist(name: string, content: string): Promise<void>;
  public abstract async retrieve(name: string): Promise<string | null>;
}

export class MemFileStore extends FileStoreService {
  public files: { [name: string]: string } = {};

  public async persist(name: string, content: string) {
    this.files[name] = content;
  }

  public async retrieve(name: string) {
    return this.files[name];
  }
}
