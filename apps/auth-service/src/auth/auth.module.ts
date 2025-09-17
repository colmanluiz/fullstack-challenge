import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm"; // ← Add this
import { JwtModule } from "@nestjs/jwt"; // ← Fix this
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { User, RefreshToken } from "../entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.register({
      secret: "your-secret-key",
      signOptions: { expiresIn: "15m" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
