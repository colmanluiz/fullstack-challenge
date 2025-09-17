import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { LoginDto, RegisterDto, RefreshTokenDto, AuthResponseDto } from "@task-management/types";

@Injectable()
export class AuthService {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authClient: ClientProxy
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    return firstValueFrom(this.authClient.send("login", loginDto));
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    return firstValueFrom(this.authClient.send("register", registerDto));
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    return firstValueFrom(this.authClient.send("refresh", refreshTokenDto));
  }

  async logout(refreshTokenDto: RefreshTokenDto): Promise<{ message: string }> {
    return firstValueFrom(this.authClient.send("logout", refreshTokenDto));
  }
}
