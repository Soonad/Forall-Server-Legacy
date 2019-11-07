import { Controller, Get, Query } from "@nestjs/common";
import {
  ApiModelProperty,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUseTags,
} from "@nestjs/swagger";
import { Matches } from "class-validator";

class Params {
  @ApiModelProperty()
  @Matches(/^[^@^\/]+@\d+$/)
  public full_name: string;
}

@Controller("codes")
@ApiUseTags("codes")
export class CodesController {
  @Get("/:full_name.fm")
  @ApiOkResponse({
    type: String,
    description: "Module was found.",
  })
  @ApiNotFoundResponse({
    description: "Module wasn't found",
  })
  public getCode(@Query() { full_name }: Params) {
    return [
      "import ChildrenModule@0",
      "",
      "my_word : Word",
      "  123",
      "",
      "main : Word",
      "  my_word",
    ].join("\n");
  }
}
