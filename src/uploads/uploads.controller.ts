import {
  Body,
  Controller,
  Get,
  HttpStatus,
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
import { FastifyReply } from "fastify";
import { ServerResponse } from "http";
import { v4 as genUUIDV4 } from "node-uuid";
import { CreateUploadRequest, Upload } from "./uploads.model";

class GetUploadParams {
  @IsUUID("4")
  @ApiModelProperty({ format: "uuid" })
  public id: string;
}

@ApiUseTags("uploads")
@Controller("uploads")
export class UploadsController {
  @Post("/")
  @ApiAcceptedResponse({
    description: "Upload was accepted and will be processed asyncronously.",
  })
  @ApiBadRequestResponse({ description: "Invalid parameters." })
  public async createUpload(
    @Body() body: CreateUploadRequest,
    @Res() res: FastifyReply<ServerResponse>,
  ) {
    res
      .header("Location", `/uploads/${genUUIDV4()}`)
      .status(HttpStatus.ACCEPTED)
      .send();
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
  public getUpload(@Query() { id }: GetUploadParams): Upload {
    const upload = new Upload();
    upload.full_name = "MyModule@0";
    upload.id = id;
    return upload;
  }
}
