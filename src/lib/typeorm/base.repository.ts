import stack from 'callsites';
import { readFile } from 'fs';
import { dirname, resolve } from 'path';
import {
  ObjectLiteral,
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  UpdateResult,
  DeleteResult
} from 'typeorm';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

/**
 * Custom Repository with enhanced query raw SQL statement
 * Compatible with IBaseRepository interface for TypeORM entities
 */
export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  /**
   * Run SQL with key value pair parameters
   *
   * @param sql sql statement
   * @param params sql parameter in key value pair
   * @see https://github.com/typeorm/typeorm/issues/556#issuecomment-317459125
   */
  async $runSQL<T>(sql: string, params: ObjectLiteral): Promise<T> {
    const [q, p] = this.manager.connection.driver.escapeQueryWithParameters(sql, params, {});
    return this.query(q, p);
  }

  /**
   * Run SQL file with key value pair parameters
   *
   * @param sqlPath sql file path
   * @param params sql parameter in key value pair
   */
  async $runSQLFile<T>(sqlPath: string, params: ObjectLiteral): Promise<T> {
    const sql = await this.$readSQLFile(sqlPath);
    console.log(sql);
    return this.$runSQL(sql, params);
  }

  /**
   * Read SQL file
   */
  private async $readSQLFile(sqlPath: string) {
    // find dirname where this function was called.
    const caller = stack()[0].getFileName() || '';
    const callerDirname = dirname(caller);
    // * ['../'] means we use this function from @lib
    return readFileAsync(resolve(callerDirname, '../', sqlPath), 'utf8');
  }

  /**
   * Create a new entity (alias for save)
   */
  async createEntity(data: Partial<T>): Promise<T> {
    const entity = this.create(data as DeepPartial<T>);
    return this.save(entity) as Promise<T>;
  }

  /**
   * Create multiple entities (alias for save)
   */
  async createMany(data: Partial<T>[]): Promise<T[]> {
    const entities = this.create(data as DeepPartial<T>[]);
    return this.save(entities) as Promise<T[]>;
  }

  /**
   * Find one entity by ID
   */
  async findById(id: string | number): Promise<T | null> {
    return this.findOneBy({ id: id as any });
  }

  /**
   * Find one entity by conditions (alias)
   */
  async findOneEntity(conditions: FindOneOptions<T>): Promise<T | null> {
    return this.findOne(conditions);
  }

  /**
   * Find all entities by conditions
   */
  async findAll(conditions?: FindManyOptions<T>): Promise<T[]> {
    return this.find(conditions);
  }

  /**
   * Find entities with pagination (custom return format)
   */
  async findAndCountPaginated(conditions?: FindManyOptions<T>): Promise<{ data: T[]; total: number }> {
    const [data, total] = await super.findAndCount(conditions);
    return { data, total };
  }

  /**
   * Update an entity by ID
   */
  async updateById(id: string | number, data: DeepPartial<T>): Promise<T | null> {
    await this.update({ id: id as any }, data as any);
    return this.findById(id);
  }

  /**
   * Update entities by conditions (custom signature)
   */
  async updateEntity(conditions: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<UpdateResult> {
    return super.update(conditions, data as any);
  }

  /**
   * Delete an entity by ID
   */
  async deleteById(id: string | number): Promise<boolean> {
    const result = await this.delete({ id: id as any });
    return !!result.affected && result.affected > 0;
  }

  /**
   * Delete entities by conditions (alias)
   */
  async deleteEntity(conditions: FindOptionsWhere<T>): Promise<DeleteResult> {
    return super.delete(conditions);
  }

  /**
   * Soft delete an entity by ID
   */
  async softDeleteById(id: string | number): Promise<boolean> {
    const result = await this.softDelete({ id: id as any });
    return !!result.affected && result.affected > 0;
  }

  /**
   * Count entities by conditions
   */
  async count(conditions?: FindOptionsWhere<T>): Promise<number> {
    return this.countBy(conditions || ({} as FindOptionsWhere<T>));
  }

  /**
   * Check if entity exists by conditions
   */
  async exists(conditions: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.countBy(conditions);
    return count > 0;
  }
}
