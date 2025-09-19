import { Body, Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto, RefreshTokenDto } from "@task-management/types";
import { MessagePattern } from "@nestjs/microservices";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern("login")
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.loginUser(loginDto);
  }

  @MessagePattern("register")
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.registerUser(registerDto);
  }

  @MessagePattern("refresh")
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return await this.authService.validateRefreshToken(refreshDto.refreshToken);
  }

  @MessagePattern("logout")
  async logout(@Body() refreshDto: RefreshTokenDto) {
    return await this.authService.logout(refreshDto.refreshToken);
  }

  @MessagePattern("user_exists")
  async userExists(userId: string) {
    return await this.authService.userExists(userId);
  }
}
