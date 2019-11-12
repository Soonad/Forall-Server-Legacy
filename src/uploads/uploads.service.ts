import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileStoreService } from "../file-store/file-store.service";
import { Upload } from "./uploads.model";

export interface ICreateUploadRequest {
  code: string;
  name: string;
}

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload) private readonly repository: Repository<Upload>,
    private readonly fileStore: FileStoreService,
  ) {}

  /**
   * Creates a new upload request for a new file. It will save the file temporarly and schedule a
   * job for processing the file and publishing it to a definitive version.
   * @param request The upload request containing the name and code of the file
   * @returns The upload id to be referenced when getting the upload result
   */
  public async createUpload({
    name,
    code,
  }: ICreateUploadRequest): Promise<string> {
    const upload = this.repository.create({ name });
    await this.repository.save(upload);
    await this.fileStore.persist(`${upload.id}/${name}.fm`, code);
    return upload.id;
  }

  /**
   * This will return an upload if and only if it finished processing with success. That is, if it
   * has already been typechecked, uploaded to distribution endpoint and assigned a version.
   * In all other cases (upload is not found or has not finished with success) it will return null.
   * @param id The id of the upload
   * @returns The processed or upload or nothing
   */
  public async getProcessedUpload(id: string): Promise<Upload | null> {
    const upload = await this.repository.findOne(id);
    if (upload && upload.version) {
      return upload;
    }
    return null;
  }
}
