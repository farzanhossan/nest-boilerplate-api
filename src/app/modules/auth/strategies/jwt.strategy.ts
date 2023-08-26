import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ENV } from '@src/env';
import { JWT_STRATEGY } from '@src/shared/constants/strategy.constants';
import { JwtPayloadType } from '@src/shared/types/jwt-payload.type';
import { OrNeverType } from '@src/shared/types/or-never.type';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ENV.jwt.secret,
    });
  }

  protected validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
    if (!payload.identifier) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
