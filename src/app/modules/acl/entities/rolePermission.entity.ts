import { BaseEntity } from '@src/app/base';
import { ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Entity, ManyToOne, RelationId } from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from './role.entity';
import { User } from '../../user/entities/user.entity';

@Entity(ENUM_TABLE_NAMES.ROLE_PERMISSIONS, { orderBy: { createdAt: 'DESC' } })
export class RolePermission extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = [];

  @ManyToOne((t) => Role, { onDelete: 'CASCADE' })
  @Type((t) => Role)
  role?: Role;

  @RelationId((e: RolePermission) => e.role)
  roleId?: string;

  @ManyToOne((t) => Permission, { onDelete: 'CASCADE' })
  @Type((t) => Permission)
  permission?: Permission;

  @RelationId((e: RolePermission) => e.permission)
  permissionId?: number;

  @ManyToOne((t) => User, { onDelete: 'NO ACTION' })
  @Type((t) => User)
  createdBy?: User;

  @RelationId((e: RolePermission) => e.createdBy)
  createdById?: number;

  @ManyToOne((t) => User, { onDelete: 'NO ACTION' })
  @Type((t) => User)
  updatedBy?: User;

  @RelationId((e: RolePermission) => e.updatedBy)
  updatedById?: number;

  constructor() {
    super();
  }
}
