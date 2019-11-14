import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, MinLength } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ICreateUploadRequest } from "./uploads.service";

export class CreateUploadRequest implements ICreateUploadRequest {
  @ApiModelProperty()
  @IsNotEmpty()
  @MinLength(1)
  public code: string;

  @ApiModelProperty()
  @IsNotEmpty()
  @MinLength(1)
  @Matches(/^[a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)*$/)
  public name: string;
}

@Entity()
export class Upload {
  @ApiModelProperty({ format: "uuid" })
  @PrimaryGeneratedColumn("uuid")
  public id: string | null;

  @ApiModelProperty({ example: "MyModule" })
  @Column()
  public name: string;

  @ApiModelProperty({ example: "0" })
  @Column({ nullable: true })
  public version?: string;

  get fileStoreKey(): string | null {
    if (!this.id) { return null; }

    return `${this.id}/${this.name}.fm`;
  }
}
