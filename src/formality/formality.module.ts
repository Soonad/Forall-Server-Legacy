import { Module } from "@nestjs/common";
import { FormalityService } from "./formality.service";

@Module({
  providers: [FormalityService],
  exports: [FormalityService],
})
export class FormalityModule {}
