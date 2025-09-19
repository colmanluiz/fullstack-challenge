import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({
    description: "Comment content",
    example: "This task looks good to me, proceeding with implementation",
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
