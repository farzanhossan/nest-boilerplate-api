import { BaseEntity } from '@src/app/base';
import { Role } from '@src/app/modules/acl/entities/role.entity';
import { ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Entity, ManyToOne, RelationId } from 'typeorm';
import { User } from './user.entity';

@Entity(ENUM_TABLE_NAMES.USER_ROLES)
export class UserRole extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = [];

  @ManyToOne((t) => Role, { onDelete: 'CASCADE' })
  @Type((t) => Role)
  role?: Role;

  @ManyToOne((t) => User, { onDelete: 'CASCADE' })
  @Type((t) => User)
  user?: User;

  @RelationId((e: UserRole) => e.role)
  roleId?: number;

  @RelationId((e: UserRole) => e.user)
  userId?: number;

  @ManyToOne((t) => User, { onDelete: 'NO ACTION' })
  @Type((t) => User)
  createdBy?: User;

  @RelationId((e: UserRole) => e.createdBy)
  createdById?: number;

  @ManyToOne((t) => User, { onDelete: 'NO ACTION' })
  @Type((t) => User)
  updatedBy?: User;

  @RelationId((e: UserRole) => e.updatedBy)
  updatedById?: number;

  constructor() {
    super();
  }
}
