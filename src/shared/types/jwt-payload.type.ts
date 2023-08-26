import { User } from '@src/app/modules/user/entities/user.entity';

export type JwtPayloadType = Pick<User, 'identifier'> & {
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
};
