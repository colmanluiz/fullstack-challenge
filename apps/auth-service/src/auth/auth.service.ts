import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { RefreshToken, User } from "src/entities";
import { MoreThan, Repository } from "typeorm";
import { LoginDto } from "./dto/login.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import * as bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    private readonly jwtService: JwtService
  ) {}

  async loginUser(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(`Invalid email or password`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(`Invalid email or password`);
    }

    return this.generateAuthResponse(user);
  }

  async registerUser(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, username, password } = registerDto;

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (user) {
      throw new UnauthorizedException("A user with this email already exists.");
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return this.generateAuthResponse(newUser);
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    await this.revokeRefreshToken(refreshToken);
    return { message: "Logged out successfully" };
  }

  async validateRefreshToken(token: string): Promise<AuthResponseDto> {
    const refreshTokenExists = await this.refreshTokenRepository.findOne({
      where: {
        token: token,
        isRevoked: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!refreshTokenExists) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const user = await this.userRepository.findOne({
      where: {
        id: refreshTokenExists.userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return this.generateAuthResponse(user);
  }

  async validateAccessToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired access token");
    }
  }

  async revokeRefreshToken(token: string): Promise<any> {
    const isToken = await this.refreshTokenRepository.findOne({
      where: { token },
    });

    if (!isToken) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    isToken.isRevoked = true;
    await this.refreshTokenRepository.save(isToken);

    return { success: true };
  }

  private async generateAuthResponse(user: User): Promise<AuthResponseDto> {
    const accessToken = this.generateAccessToken(user);
    if (!accessToken) {
      throw new UnauthorizedException("Could not generate access token");
    }

    const refreshToken = this.generateRefreshToken();
    if (!refreshToken) {
      throw new UnauthorizedException("Could not generate refresh token");
    }

    const refreshTokenEntity = this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  private generateAccessToken(user: User): string {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        username: user.username,
      },
      { expiresIn: `15m` }
    );
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  private hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
