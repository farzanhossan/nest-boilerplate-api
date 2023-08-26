import { DataSource } from 'typeorm';

export const startTransaction = async (dataSource: DataSource) => {
  const queryRunner = await dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  return queryRunner;
};

export const commitTransaction = async (queryRunner) => {
  await queryRunner.commitTransaction();
  await queryRunner.release();
  return queryRunner;
};

export const rollbackTransaction = async (queryRunner) => {
  await queryRunner.rollbackTransaction();
  await queryRunner.release();
  return queryRunner;
};
