import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Job, Queue } from "bull";
import {
  InjectQueue,
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from "nest-bull";
import { Repository } from "typeorm";

import { FileStoreService } from "../file-store/file-store.service";
import { FormalityService } from "../formality/formality.service";
import { CHECK_JOB, PUBLISH_JOB, UPLOADS_QUEUE } from "./uploads.constants";
import { Upload } from "./uploads.model";

@Processor({ name: UPLOADS_QUEUE })
export class UploadsProcessor {
  private readonly logger = new Logger(UploadsProcessor.name);

  constructor(
    @InjectRepository(Upload) private readonly repository: Repository<Upload>,
    private readonly fileStore: FileStoreService,
    private readonly formality: FormalityService,
    @InjectQueue(UPLOADS_QUEUE) private readonly queue: Queue,
  ) {}

  @Process({ name: CHECK_JOB })
  public async processCheck(job: Job<{ id: string }>) {
    const upload = await this.repository.findOneOrFail(job.data.id);
    const content = await this.fileStore.retrieve(upload.fileStoreKey);

    if (await this.formality.typechecks(content)) {
      this.queue.add(PUBLISH_JOB, job.data);
    }
  }

  @Process({ name: PUBLISH_JOB })
  public async processPublish(job: Job<{ id: string }>) {
    // TODO: Implement the actual publishing process
  }

  @OnQueueActive()
  public onActive(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueCompleted()
  public onCompleted(job: Job) {
    this.logger.log(
      `Completed job ${job.id} of type ${job.name} with result ${job.returnvalue}`,
    );
  }
}
