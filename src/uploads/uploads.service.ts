import { Injectable } from '@nestjs/common';

export interface ICreateUploadRequest {
  code: string;
  name: string;
}

@Injectable()
export class UploadsService {
  async createUpload() {}
}
