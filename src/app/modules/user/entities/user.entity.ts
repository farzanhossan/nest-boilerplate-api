import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Role } from '../../acl/entities/role.entity';
import { UserRole } from './userRole.entity';

@Entity(ENUM_TABLE_NAMES.USERS)
export class User extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = [
    'email',
    'username',
    'phoneNumber',
    'firstName',
    'lastName',
    'fullName',
  ];

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ unique: true, nullable: true })
  identifier?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, nullable: true, default: false })
  isTwoFactorEnabled?: boolean;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  twoFactorSecret?: string;

  @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, nullable: true, default: false })
  isOtpVerified?: boolean;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  otpVerificationMethod?: string;

  @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, nullable: true, default: false })
  isOtpVerificationRequired?: boolean;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  authProvider?: string;

  @Column({ select: false, nullable: true })
  password?: string;

  @Column({ select: false, nullable: true, type: ENUM_COLUMN_TYPES.TEXT })
  accessToken?: string;

  @Column({ select: false, nullable: true, type: ENUM_COLUMN_TYPES.TEXT })
  permissionToken?: string;

  @Column({ select: false, nullable: true, type: ENUM_COLUMN_TYPES.TEXT })
  refreshToken?: string;

  @OneToMany((t) => UserRole, (e) => e.user)
  @Type((t) => UserRole)
  userRoles?: UserRole[];

  roles?: Role[] = [];

  @ManyToOne((t) => User, { onDelete: 'NO ACTION' })
  @Type((t) => User)
  createdBy?: User;

  @RelationId((e: User) => e.createdBy)
  createdById?: number;

  @ManyToOne((t) => User, { onDelete: 'NO ACTION' })
  @Type((t) => User)
  updatedBy?: User;

  @RelationId((e: User) => e.updatedBy)
  updatedById?: number;

  constructor() {
    super();
  }
}
