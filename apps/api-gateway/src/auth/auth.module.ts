import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "AUTH_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST || "localhost",
          port: parseInt(process.env.AUTH_SERVICE_PORT as string) || 3003,
        },
      },
    ]),
  ],
  controllers: [],
  providers: [AuthService],
})
export class AuthModule {}
