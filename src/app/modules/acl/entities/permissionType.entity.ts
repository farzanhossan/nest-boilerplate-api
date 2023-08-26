import { BaseEntity } from '@src/app/base';
import { ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity(ENUM_TABLE_NAMES.PERMISSION_TYPES, { orderBy: { createdAt: 'DESC' } })
export class PermissionType extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title'];

  @Column()
  title?: string;

  @ManyToOne((t) => User, { onDelete: 'NO ACTION' })
  @Type((t) => User)
  createdBy?: User;

  @RelationId((e: PermissionType) => e.createdBy)
  createdById?: number;

  @ManyToOne((t) => User, { onDelete: 'NO ACTION' })
  @Type((t) => User)
  updatedBy?: User;

  @RelationId((e: PermissionType) => e.updatedBy)
  updatedById?: number;

  constructor() {
    super();
  }
}
