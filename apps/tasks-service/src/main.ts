import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common/services/logger.service";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: "0.0.0.0", // Bind to all interfaces for Docker networking
        port: parseInt(process.env.MICROSERVICE_PORT as string) || 3003,
      },
    }
  );

  await app.listen();
  Logger.log(
    `Tasks service microservice running on TCP port ${process.env.MICROSERVICE_PORT || 3003}`
  );
}

bootstrap();
