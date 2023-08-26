import { PermissionType } from './permissionType.entity';
import { BaseEntity } from '@src/app/base';
import { ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Type } from 'class-transformer';
import { User } from '../../user/entities/user.entity';

@Entity(ENUM_TABLE_NAMES.PERMISSIONS, { orderBy: { createdAt: 'DESC' } })
export class Permission extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title'];

  @Column()
  title?: string;

  @ManyToOne((t) => PermissionType, { onDelete: 'NO ACTION' })
  @Type((t) => PermissionType)
  permissionType?: PermissionType;

  @RelationId((e: Permission) => e.permissionType)
  permissionTypeId?: number;

  @ManyToOne((t) => User, { onDelete: 'NO ACTION' })
  @Type((t) => User)
  createdBy?: User;

  @RelationId((e: Permission) => e.createdBy)
  createdById?: number;

  @ManyToOne((t) => User, { onDelete: 'NO ACTION' })
  @Type((t) => User)
  updatedBy?: User;

  @RelationId((e: Permission) => e.updatedBy)
  updatedById?: number;

  isAlreadyAdded?: boolean = false;

  constructor() {
    super();
  }
}
