import { ApiModelProperty } from "@nestjs/swagger";

export class Module {
  @ApiModelProperty({ example: "MyModule" })
  public name: string;

  @ApiModelProperty({ type: "integer", minimum: 0 })
  public version: number;

  @ApiModelProperty({ example: ["ParentModule@0"] })
  public referenced_by: string[];

  @ApiModelProperty({ example: ["ChildrenModule@0"] })
  public deep_children: string[];
}
