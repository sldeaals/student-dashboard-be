import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import mongoConfig from './config/mongo.config';
import { validationSchema } from './config/validation';
import { ThrottleConfig, MongoConfig } from './config/types';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, mongoConfig],
      validationSchema,
    }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const throttle = config.get<ThrottleConfig>('throttle');

        return {
          throttlers: [
            {
              name: 'auth',
              ttl: throttle?.ttl ?? 60,
              limit: throttle?.limit ?? 20,
            },
          ],
        };
      },
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mongo = config.get<MongoConfig>('mongo');
        if (!mongo) {
          throw new Error('Mongo config missing');
        }
        return {
          uri: mongo.uri,
          ...mongo.options,
        };
      },
    }),

    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
