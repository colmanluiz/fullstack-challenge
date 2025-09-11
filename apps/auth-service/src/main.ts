import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.HOST || '0.0.0.0',
        port: parseInt(process.env.PORT as string, 10) || 3002,
      },
    },
  );

  await app.listen();
  Logger.log(`Auth service is running on TCP port ${process.env.PORT || 3002}`);
}
bootstrap();