import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
  @ApiProperty({ example: "some-refresh-token-string", description: "Refresh token" })
  @IsString()
  readonly refreshToken: string;
}
