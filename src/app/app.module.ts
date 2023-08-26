import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from '@src/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventSourcingModule } from './event-sourcing/eventSourcing.module';
import { ExceptionFilter } from './filters';
import { HelpersModule } from './helpers/helpers.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AuthMiddleware } from './middlewares';
import { AclModule } from './modules/acl/acl.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

const MODULES = [
  DatabaseModule,
  HelpersModule,
  AclModule,
  UserModule,
  AuthModule,
  EventSourcingModule,
];
@Module({
  imports: [...MODULES],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/auth/change-password', method: RequestMethod.PATCH });
  }
}
