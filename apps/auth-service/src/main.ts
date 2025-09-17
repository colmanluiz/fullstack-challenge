import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.HOST || "0.0.0.0",
        port: parseInt(process.env.MICROSERVICE_PORT as string, 10) || 3003,
      },
    }
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen();

  Logger.log(
    `Auth service microservice running on TCP port ${process.env.MICROSERVICE_PORT || 3003}`
  );
}
bootstrap();
