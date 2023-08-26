import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpersModule } from '../../helpers/helpers.module';
import { AclModule } from './../acl/acl.module';
import { UserModule } from './../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

const entities = [];
const services = [AuthService];
const subscribers = [];
const controllers = [AuthController];
const modules = [HelpersModule, UserModule, AclModule, HttpModule];
const strategies = [LocalStrategy, JwtStrategy];
const guards = [RolesGuard, PermissionsGuard];

@Module({
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  providers: [...services, ...subscribers, ...strategies, ...guards],
  exports: [...services, ...subscribers],
  controllers: [...controllers],
})
export class AuthModule {}
