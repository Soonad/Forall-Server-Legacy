import { Injectable } from "@nestjs/common";
import { FileStoreService } from "../file-store.service";

@Injectable()
export class InMemoryFileStoreService extends FileStoreService {
  public files: { [name: string]: string } = {};

  public async persist(name: string, content: string) {
    this.files[name] = content;
  }

  public async retrieve(name: string) {
    return this.files[name];
  }
}
