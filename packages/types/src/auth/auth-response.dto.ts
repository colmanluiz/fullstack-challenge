import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", description: "JWT access token" })
  accessToken: string;

  @ApiProperty({ example: "some-refresh-token-string", description: "Refresh token" })
  refreshToken: string;

  @ApiProperty({
    description: "User information",
    example: {
      id: 1,
      email: "user@example.com",
      username: "johndoe"
    }
  })
  user: {
    id: number;
    email: string;
    username: string;
  };
}