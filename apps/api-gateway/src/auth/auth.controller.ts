import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshTokenDto, RegisterDto } from "@task-management/types";
import {
  ApiBearerAuth,
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
  @ApiResponse({
    status: 200,
    description: "Successful login",
    type: "AuthResponseDto",
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post("register")
  @ApiOperation({ summary: "User registration" })
  @ApiResponse({
    status: 201,
    description: "User registered successfully",
    type: "AuthResponseDto",
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post("refresh")
  @ApiOperation({ summary: "Refresh authentication token" })
  @ApiResponse({
    status: 200,
    description: "Token refreshed successfully",
    type: "AuthResponseDto",
  })
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshDto);
  }

  @Post("logout")
  @ApiOperation({ summary: "User logout" })
  @ApiResponse({
    status: 200,
    description: "User logged out successfully",
    type: Object,
  })
  async logout(@Body() refreshDto: RefreshTokenDto) {
    return await this.authService.logout(refreshDto);
  }
}
