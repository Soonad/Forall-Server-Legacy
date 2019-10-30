import { Controller, Post, Res, HttpStatus, Body } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import { ApiModelProperty, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

class CreateUploadDTO {
  @ApiModelProperty()
  @IsNotEmpty()
  @MinLength(1)
  code: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @MinLength(1)
  name: string;
}

@ApiUseTags('uploads')
@Controller('uploads')
export class UploadsController {
  @Post('/')
  @ApiResponse({
    status: 202,
    description: 'Upload was accepted and will be processed asyncronously.',
  })
  createUpload(
    @Body() body: CreateUploadDTO,
    @Res() res: FastifyReply<ServerResponse>,
  ) {
    res
      .header('Location', '/uploads/123')
      .status(HttpStatus.ACCEPTED)
      .send();
  }
}
