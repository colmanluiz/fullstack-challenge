import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", description: "JWT access token" })
  accessToken: string;

  @ApiProperty({ example: "some-refresh-token-string", description: "Refresh token" })
  refreshToken: string;

  @ApiProperty({
    description: "User information",
    example: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "user@example.com",
      username: "johndoe"
    }
  })
  user: {
    id: string;
    email: string;
    username: string;
  };
}