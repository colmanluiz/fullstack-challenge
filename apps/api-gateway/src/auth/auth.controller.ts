import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshTokenDto, RegisterDto, AuthResponseDto } from "@task-management/types";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "User login" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "Successful login",
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid credentials" })
  @ApiResponse({ status: 429, description: "Too many requests" })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post("register")
  @ApiOperation({ summary: "User registration" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: "User registered successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: "Validation failed or user already exists" })
  @ApiResponse({ status: 429, description: "Too many requests" })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post("refresh")
  @ApiOperation({ summary: "Refresh authentication token" })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: "Token refreshed successfully",
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid refresh token" })
  @ApiResponse({ status: 429, description: "Too many requests" })
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshDto);
  }

  @Post("logout")
  @ApiOperation({ summary: "User logout" })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: "User logged out successfully",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Successfully logged out" }
      }
    }
  })
  @ApiResponse({ status: 400, description: "Invalid refresh token" })
  @ApiResponse({ status: 429, description: "Too many requests" })
  async logout(@Body() refreshDto: RefreshTokenDto) {
    return await this.authService.logout(refreshDto);
  }
}
