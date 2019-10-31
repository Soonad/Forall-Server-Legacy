import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUploadRequest {
  @ApiModelProperty()
  @IsNotEmpty()
  @MinLength(1)
  code: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @MinLength(1)
  name: string;
}

export class Upload {
  @ApiModelProperty({ format: 'uuid' })
  id: string;

  @ApiModelProperty({ example: 'MyModule@0' })
  full_name: string;
}
