import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Task } from "../entities/task.entity";
import { ValidationService } from "./services/validation.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
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
  providers: [ValidationService],
  exports: [ValidationService],
})
export class SharedModule {}
