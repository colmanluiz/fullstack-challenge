import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "user@example.com", description: "User email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "johndoe", description: "Username", minLength: 3 })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: "password123", description: "User password", minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}