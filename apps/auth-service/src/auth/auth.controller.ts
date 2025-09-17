import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RefreshTokenDto } from "./dto/refresh.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.loginUser(loginDto);
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.registerUser(registerDto);
  }

  @Post("refresh")
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return await this.authService.validateRefreshToken(refreshDto.refreshToken);
  }

  @Post("logout")
  async logout(@Body() refreshDto: RefreshTokenDto) {
    return await this.authService.logout(refreshDto.refreshToken);
  }
}
