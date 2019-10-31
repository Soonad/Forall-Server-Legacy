import { ApiModelProperty } from '@nestjs/swagger';

export class Module {
  @ApiModelProperty({ example: 'MyModule' })
  name: string;

  @ApiModelProperty({ type: 'integer', minimum: 0 })
  version: number;

  @ApiModelProperty({ example: ['ParentModule@0'] })
  referenced_by: string[];

  @ApiModelProperty({ example: ['ChildrenModule@0'] })
  deep_children: string[];
}
