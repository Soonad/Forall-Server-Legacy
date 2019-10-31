import {
  Controller,
  Post,
  Res,
  HttpStatus,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import {
  ApiModelProperty,
  ApiUseTags,
  ApiAcceptedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateUploadRequest, Upload } from './uploads.model';
import { v4 as genUUIDV4 } from 'node-uuid';

class GetUploadParams {
  @IsUUID('4')
  @ApiModelProperty({ format: 'uuid' })
  id: string;
}

@ApiUseTags('uploads')
@Controller('uploads')
export class UploadsController {
  @Post('/')
  @ApiAcceptedResponse({
    description: 'Upload was accepted and will be processed asyncronously.',
  })
  @ApiBadRequestResponse({ description: 'Invalid parameters.' })
  async createUpload(
    @Body() body: CreateUploadRequest,
    @Res() res: FastifyReply<ServerResponse>,
  ) {
    res
      .header('Location', `/uploads/${genUUIDV4()}`)
      .status(HttpStatus.ACCEPTED)
      .send();
  }

  @Get('/:id')
  @ApiOkResponse({
    type: Upload,
    description: 'Upload was found and processed correctly.',
  })
  @ApiNotFoundResponse({
    description: "Upload is still processing or doesn't exist.",
  })
  @ApiBadRequestResponse({ description: 'Invalid parameters.' })
  getUpload(@Query() { id }: GetUploadParams): Upload {
    let upload = new Upload();
    upload.full_name = 'MyModule@0';
    upload.id = id;
    return upload;
  }
}
