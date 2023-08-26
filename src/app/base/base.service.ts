import { NotFoundException } from '@nestjs/common';
import { BaseEntity, IBaseService } from '@src/app/base';
import { toNumber } from '@src/shared';
import { isNumber, isNumberString } from 'class-validator';
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  ObjectID,
  Repository,
  SaveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IFindAllBaseOptions, IFindByIdBaseOptions } from '../interfaces';
import { SuccessResponse } from '../types';

export abstract class BaseService<T extends BaseEntity> implements IBaseService<T> {
  constructor(public repo: Repository<T>) {}

  public async find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repo.find(options);
  }

  public async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repo.count(options);
  }

  public async findOne(options?: FindOneOptions<T>): Promise<T> {
    return this.repo.findOne(options);
  }

  public async delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindOptionsWhere<T>,
  ): Promise<DeleteResult> {
    return this.repo.delete(criteria);
  }

  public async save(
    entities: T[],
    options?: SaveOptions & {
      reload: false;
    },
  ): Promise<T[]> {
    return this.repo.save(entities, options);
  }

  public async saveOne(
    entity: T,
    options?: SaveOptions & {
      reload: false;
    },
  ): Promise<T> {
    return this.repo.save(entity, options);
  }

  public async isExist(filters: T): Promise<T> {
    const isExist = await this.repo.findOne({
      where: filters as FindOptionsWhere<T>,
    });
    let msg = '';
    if (filters?.id) {
      msg = `ID ${filters.id}`;
    }
    if (!isExist) {
      throw new NotFoundException(`${this.repo.metadata.name} With ${msg} Not Found`);
    }
    return isExist;
  }

  async findAllBase(
    filters: T & {
      searchTerm?: string;
      limit?: number;
      page?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
    options?: IFindAllBaseOptions,
  ): Promise<SuccessResponse | T[]> {
    const { sortBy, sortOrder, searchTerm, limit: take, page, ...queryOptions } = filters;
    const skip = (page - 1) * take;

    if (searchTerm && this.repo.target.valueOf().hasOwnProperty('SEARCH_TERMS')) {
      let SEARCH_TERMS = (this.repo.target.valueOf() as any).SEARCH_TERMS || [];

      if (Object.keys(queryOptions).length) {
        SEARCH_TERMS = SEARCH_TERMS.filter((term) => !term.includes(Object.keys(queryOptions)));
      }

      const relations = this.repo.metadata.relations.map((r) => r.propertyName);

      Object.keys(queryOptions).forEach((key) => {
        if (
          relations.includes(key) &&
          (isNumberString(queryOptions[key]) || isNumber(queryOptions[key]))
        ) {
          queryOptions[key] = {
            id: queryOptions[key],
          };
        }
      });

      const where = [];

      for (const term of SEARCH_TERMS) {
        where.push({
          ...queryOptions,
          [term]: ILike(`%${searchTerm}%`),
        });
      }

      const opts: FindManyOptions = {
        where,
        skip,
        take,
        relations: options?.relations || [],
      };

      if (sortBy && sortOrder) {
        opts.order = {
          [sortBy]: sortOrder,
        };
      }

      const result = await this.repo.findAndCount(opts);

      return new SuccessResponse(`${this.repo.metadata.name} fetched successfully`, result, {
        total: result[1],
        page: toNumber(page),
        limit: toNumber(take),
        skip,
      });
    } else {
      const relations = this.repo.metadata.relations.map((r) => r.propertyName);

      Object.keys(queryOptions).forEach((key) => {
        if (
          relations.includes(key) &&
          (isNumberString(queryOptions[key]) || isNumber(queryOptions[key]))
        ) {
          queryOptions[key] = {
            id: queryOptions[key],
          };
        }
      });

      const opts: FindManyOptions = {
        where: queryOptions as FindOptionsWhere<T>,
      };

      if (skip && !isNaN(skip)) opts.skip = skip;
      if (take && !isNaN(take)) opts.take = take;
      if (options?.relations && Array.isArray(options.relations)) {
        opts.relations = options?.relations || [];
      }

      if (sortBy && sortOrder) {
        opts.order = {
          [sortBy]: sortOrder,
        };
      }

      if (options?.withoutPaginate) {
        return await this.repo.find(opts);
      } else {
        const result = await this.repo.findAndCount(opts);

        return new SuccessResponse(`${this.repo.metadata.name} fetched successfully`, result[0], {
          total: result[1],
          page: toNumber(page),
          limit: toNumber(take),
          skip,
        });
      }
    }
  }

  async findByIdBase(id: number, options?: IFindByIdBaseOptions): Promise<T> {
    return await this.repo.findOne({
      where: {
        id,
      },
      relations: options?.relations || [],
    } as FindOneOptions);
  }

  async findOneBase(filters: T, options?: IFindByIdBaseOptions): Promise<T> {
    const relations = this.repo.metadata.relations.map((r) => r.propertyName);

    Object.keys(filters).forEach((key) => {
      if (relations.includes(key) && (isNumberString(filters[key]) || isNumber(filters[key]))) {
        filters[key] = {
          id: filters[key],
        };
      }
    });
    return await this.repo.findOne({
      where: {
        ...filters,
      },
      relations: options?.relations || [],
    } as FindOneOptions);
  }

  async createOneBase(data: T, options?: IFindByIdBaseOptions): Promise<T> {
    const created = await this.repo.save(data);
    return await this.findByIdBase(created.id, options);
  }

  async updateOneBase(
    id: number,
    data: QueryDeepPartialEntity<T>,
    options?: IFindByIdBaseOptions,
  ): Promise<T> {
    await this.repo.update(id, data);
    return await this.findByIdBase(id, options);
  }

  async deleteOneBase(id: number): Promise<SuccessResponse> {
    await this.repo.delete(id);
    return new SuccessResponse(`${this.repo.metadata.name} deleted successfully`, null);
  }

  async deleteBulkBase(id: number[]): Promise<SuccessResponse> {
    await this.repo.delete(id);
    return new SuccessResponse(`${this.repo.metadata.name} deleted successfully`, null);
  }

  async softDeleteOneBase(id: number): Promise<SuccessResponse> {
    await this.repo.softDelete(id);
    return new SuccessResponse(`${this.repo.metadata.name} deleted successfully`, null);
  }

  async recoverByIdBase(id: number, options?: IFindByIdBaseOptions): Promise<T> {
    await this.repo.recover({ id } as DeepPartial<T>);
    return await this.findByIdBase(id, options);
  }
}
