import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUseTags,
  ApiModelProperty,
} from '@nestjs/swagger';
import { Matches } from 'class-validator';

import { Module } from './modules.model';

class GetModuleParams {
  @ApiModelProperty()
  @Matches(/^[^@^\/]+@\d+$/)
  full_name: string;
}

@Controller('modules')
@ApiUseTags('modules')
export class ModulesController {
  @Get('/:full_name')
  @ApiOkResponse({
    type: Module,
    description: 'Module was found.',
  })
  @ApiNotFoundResponse({
    description: "Module wasn't found",
  })
  @ApiBadRequestResponse({ description: 'Invalid parameters.' })
  getModule(@Query() { full_name }: GetModuleParams): Module {
    let [name, version] = full_name.split('@');
    let upload = new Module();
    upload.name = name;
    upload.version = +version;
    upload.referenced_by = ['ParentModule@0'];
    upload.deep_children = ['ChildrenModule@0'];
    return upload;
  }
}
