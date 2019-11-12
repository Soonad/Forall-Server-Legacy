import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiModelProperty,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUseTags,
} from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { HttpResponse } from "../http-response.interceptor";
import { CreateUploadRequest, Upload } from "./uploads.model";
import { UploadsService } from "./uploads.service";

class GetUploadParams {
  @IsUUID("4")
  @ApiModelProperty({ format: "uuid" })
  public id: string;
}

@ApiUseTags("uploads")
@Controller("uploads")
export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  @Post("/")
  @ApiAcceptedResponse({
    description: "Upload was accepted and will be processed asyncronously.",
  })
  @ApiBadRequestResponse({ description: "Invalid parameters." })
  public async createUpload(@Body() body: CreateUploadRequest) {
    const id = await this.service.createUpload(body);

    return new HttpResponse(undefined, {
      headers: {
        Location: `/uploads/${id}`,
      },
      status: 202,
    });
  }

  @Get("/:id")
  @ApiOkResponse({
    type: Upload,
    description: "Upload was found and processed correctly.",
  })
  @ApiNotFoundResponse({
    description: "Upload is still processing or doesn't exist.",
  })
  @ApiBadRequestResponse({ description: "Invalid parameters." })
  public async getUpload(@Query() { id }: GetUploadParams): Promise<Upload> {
    const upload = await this.service.getProcessedUpload(id);
    if (!upload) { throw new NotFoundException(); }
    return upload;
  }
}
