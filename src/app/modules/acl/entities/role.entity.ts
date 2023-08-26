import { BaseEntity } from '@src/app/base';
import { ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity(ENUM_TABLE_NAMES.ROLES, { orderBy: { createdAt: 'DESC' } })
export class Role extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['title'];

  @Column()
  title?: string;

  @ManyToOne((t) => User, { onDelete: 'NO ACTION' })
  @Type((t) => User)
  createdBy?: User;

  @RelationId((e: Role) => e.createdBy)
  createdById?: number;

  @ManyToOne((t) => User, { onDelete: 'NO ACTION' })
  @Type((t) => User)
  updatedBy?: User;

  @RelationId((e: Role) => e.updatedBy)
  updatedById?: number;

  isAlreadyAdded?: boolean = false;

  constructor() {
    super();
  }
}
