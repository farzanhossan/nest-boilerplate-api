import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { FilterRoleDTO } from '../../acl/dtos';
import { Role } from '../../acl/entities/role.entity';
import { CreateUserDTO, FilterUserDTO, UpdateUserDTO } from '../dtos';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { BaseBulkDeleteDTO } from '@src/app/base/baseBulkDelete.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  RELATIONS = ['userRoles', 'userRoles.role'];
  constructor(private readonly service: UserService) {}

  @Get()
  async findAll(@Query() query: FilterUserDTO): Promise<SuccessResponse | User[]> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id/available-roles')
  async availableRoles(@Param('id') id: number, @Query() query: FilterRoleDTO): Promise<Role[]> {
    return this.service.availableRoles(id, query);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<User> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  async createOne(@Body() body: CreateUserDTO): Promise<User> {
    return this.service.createUser(body, this.RELATIONS);
  }

  //   @Post('recover/:id')
  //   async recoverById(@Param('id') id: string): Promise<User> {
  //     return this.service.recoverByIdBase(id);
  //   }

  @Patch(':id')
  async updateOne(@Param('id') id: number, @Body() body: UpdateUserDTO): Promise<User> {
    return this.service.updateUser(id, body, this.RELATIONS);
  }

  @Delete('bulk')
  async deleteBulk(@Body() body: BaseBulkDeleteDTO): Promise<SuccessResponse> {
    return this.service.deleteBulkBase(body.ids);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }

  //   @Delete('soft/:id')
  //   async softDeleteOne(@Param('id') id: string): Promise<SuccessResponse> {
  //     return this.service.softDeleteOneBase(id);
  //   }
}
