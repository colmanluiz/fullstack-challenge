import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksModule } from "./tasks/tasks.module";
import { CommentsModule } from "./comments/comments.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DB_HOST") || "localhost",
        port: configService.get<number>("DB_PORT") || 5432,
        username: configService.get<string>("DB_USERNAME") || "postgres",
        password: configService.get<string>("DB_PASSWORD") || "password",
        database: configService.get<string>("DB_NAME") || "challenge_db",
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get<string>("NODE_ENV") === "development",
        logging: configService.get<string>("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    TasksModule,
    CommentsModule,
  ],
})
export class AppModule {}
