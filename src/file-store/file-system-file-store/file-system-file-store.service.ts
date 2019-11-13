import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import { ConfigService } from "nestjs-config";
import { dirname, join } from "path";
import { promisify } from "util";
import { FileStoreService } from "../file-store.service";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

@Injectable()
export class FileSystemFileStoreService extends FileStoreService {
  private readonly basePath: string;
  constructor(config: ConfigService) {
    super();
    this.basePath = config.get("file-store.fsStoreBasePath");
  }

  public async persist(name: string, content: string) {
    const path = join(this.basePath, name);
    const dir = dirname(path);

    if (name.match(/(\.\.)/)) {
      throw new Error("File cannot contain two dots in sequence");
    }

    if (await exists(path)) {
      throw new Error("File already exists");
    }

    await mkdir(dir, { recursive: true });

    await writeFile(path, content, { encoding: "utf-8" });
  }

  public async retrieve(name: string) {
    const path = join(this.basePath, name);
    if (await exists(path)) {
      return await readFile(path, { encoding: "utf-8" });
    }
  }
}
