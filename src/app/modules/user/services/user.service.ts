import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base/base.service';
import { BcryptHelper } from '@src/app/helpers';
import { ENUM_ACL_DEFAULT_ROLES, identifyIdentifier } from '@src/shared';
import { isNotEmptyObject } from 'class-validator';
import { DataSource, Repository } from 'typeorm';
import { AsyncForEach } from 'utils-friendly';
import { FilterRoleDTO } from '../../acl/dtos';
import { Role } from '../../acl/entities/role.entity';
import { RoleService } from '../../acl/services/role.service';
import { LoginDTO, RegisterDTO } from '../../auth/dtos';
import { CreateRolesDTO, CreateUserDTO, UpdateRolesDTO, UpdateUserDTO } from '../dtos';
import { User } from '../entities/user.entity';
import { UserRole } from './../entities/userRole.entity';
import { UserRoleService } from './userRole.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RoleService,
    private readonly bcrypt: BcryptHelper,
    private readonly dataSource: DataSource,
    private readonly cmdBus: CommandBus,
  ) {
    super(userRepository);
  }

  async availableRoles(id: number, payload: FilterRoleDTO): Promise<any> {
    const isExist = await this.isExist({ id });

    const roles = (await this.roleService.findAllBase(payload, {
      withoutPaginate: true,
    })) as Role[];

    const userRoles = await this.userRoleService.find({
      where: {
        user: { id: isExist.id as any },
      },
    });

    if (roles && roles.length > 0) {
      roles.forEach((role) => {
        const isAlreadyAdded = userRoles.find((userRole) => userRole.roleId === role.id);
        role.isAlreadyAdded = !!isAlreadyAdded;
      });
    }

    return roles;
  }

  async createUser(payload: CreateUserDTO, relations: string[]): Promise<User> {
    const { roles, ..._userData } = payload;

    const userData = await identifyIdentifier(payload.identifier, _userData);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let createdUser = null;

    try {
      createdUser = await queryRunner.manager.save(Object.assign(new User(), userData));

      if (!createdUser) {
        throw new BadRequestException('User not created');
      }

      if (roles && roles.length) {
        await AsyncForEach(roles, async (role: CreateRolesDTO) => {
          const isRoleExist = await this.roleService.isExist({ id: role.role });
          await queryRunner.manager.save(
            Object.assign(new UserRole(), {
              user: createdUser.id,
              role: role.role,
            }),
          );
        });
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw new BadRequestException(error.message || 'User not created');
    }

    if (!createdUser) {
      throw new BadRequestException('User not created');
    }

    const updatedUser = await this.findOne({
      where: {
        id: createdUser.id,
      },
      relations,
    });

    return updatedUser;
  }

  async updateUser(id: number, payload: UpdateUserDTO, relations: string[]): Promise<User> {
    const isUserExist = await this.isExist({ id });

    const { roles, ...userData } = payload;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (isNotEmptyObject(userData)) {
        await queryRunner.manager.update(User, { id }, userData);
      }

      if (roles && roles.length > 0) {
        const deletedItems = roles.filter((role) => role.isDeleted);
        const newOrUpdatedItems = roles.filter((role) => !role.isDeleted);

        await AsyncForEach(deletedItems, async (role: UpdateRolesDTO) => {
          const isUserRoleExist = await this.userRoleService.isExist({
            user: { id },
            role: { id: role.role },
          });
          await queryRunner.manager.delete(UserRole, {
            user: { id },
            role: { id: role.role },
          });
        });

        await AsyncForEach(newOrUpdatedItems, async (role: UpdateRolesDTO) => {
          const isRoleExist = await this.roleService.isExist({
            id: role.role,
          });
          const isUserRoleExist = await this.userRoleService.findOne({
            where: {
              user: { id },
              role: { id: role.role },
            },
          });

          if (!isUserRoleExist) {
            await queryRunner.manager.save(
              Object.assign(new UserRole(), {
                user: id,
                role: role.role,
              }),
            );
          }
        });
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw new BadRequestException(error.message || 'User not updated');
    }

    const updatedUser = await this.findOne({
      where: {
        id: id,
      },
      relations,
    });

    return updatedUser;
  }

  async findOrCreateByPhoneNumber(phoneNumber: string): Promise<User> {
    const role = await this.roleService.findOneBase({
      title: ENUM_ACL_DEFAULT_ROLES.CUSTOMER,
    });
    const isExist = await this.findOneBase({ phoneNumber });

    if (isExist) {
      return isExist;
    } else {
      const user = await this.createOneBase({
        phoneNumber,
      });

      const userRole = await this.userRoleService.createOneBase({
        user: user.id as any,
        role: role.id as any,
      });
      return user;
    }
  }

  async registerUser(_payload: RegisterDTO): Promise<User> {
    const payload = await identifyIdentifier(_payload.identifier, _payload);
    const role = await this.roleService.findOneBase({
      title: payload.role,
    });
    const isExist = await this.findOneBase({ identifier: payload.identifier });

    if (isExist) {
      throw new ConflictException('Identifier already exists');
    } else {
      const createdUser = await this.createOneBase({
        identifier: payload?.identifier,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload?.email || null,
        username: payload?.username || null,
        phoneNumber: payload?.phoneNumber || null,
        password: payload.password,
      });

      const userRole = await this.userRoleService.createOneBase({
        user: createdUser.id as any,
        role: role.id as any,
      });
      return createdUser;
    }
  }

  async loginUser(payload: LoginDTO): Promise<User> {
    const isExist = await this.findOne({
      where: { identifier: payload.identifier },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'password',
        'phoneNumber',
        'username',
        'identifier',
      ],
    });

    if (!isExist) {
      throw new BadRequestException('User does not exists');
    }

    const isPasswordMatch = await this.bcrypt.compareHash(payload.password, isExist.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('Password does not match');
    }

    return isExist;
  }
}
