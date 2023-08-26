import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JWTHelper } from '../helpers';
import { RequestMethods } from '../enums';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtHelper: JWTHelper) {}
  async use(req: any, res: Response, next) {
    const token = this.jwtHelper.extractToken(req.headers);
    const verifiedUser: any = await this.jwtHelper.verify(token);

    if (!verifiedUser) {
      throw new UnauthorizedException('Unauthorized Access Detected');
    }

    req.verifiedUser = verifiedUser.user;

    if (req.method === RequestMethods.POST) {
      req.body.createdBy = verifiedUser.user.id;
    } else if (req.method === RequestMethods.PUT) {
      req.body.updatedBy = verifiedUser.user.id;
    } else if (req.method === RequestMethods.PATCH) {
      req.body.updatedBy = verifiedUser.user.id;
    }

    next();
  }
}
