import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class CreateUploadRequest {
  @ApiModelProperty()
  @IsNotEmpty()
  @MinLength(1)
  public code: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @MinLength(1)
  public name: string;
}

export class Upload {
  @ApiModelProperty({ format: "uuid" })
  public id: string;

  @ApiModelProperty({ example: "MyModule@0" })
  public full_name: string;
}
