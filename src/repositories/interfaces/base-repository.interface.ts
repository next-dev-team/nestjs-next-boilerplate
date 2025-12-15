import { FindManyOptions, FindOneOptions } from 'typeorm';
import { FilterQuery, UpdateQuery } from 'mongoose';

/**
 * Base repository interface that works for both TypeORM and Mongoose
 */
export interface IBaseRepository<T> {
  /**
   * Create a new entity
   */
  createEntity?(data: Partial<T>): Promise<T>;

  /**
   * Create multiple entities
   */
  createMany(data: Array<Partial<T>>): Promise<T[]>;

  /**
   * Find one entity by ID
   */
  findById(id: string | number): Promise<T | null>;

  /**
   * Find one entity by conditions
   */
  findOneEntity?(conditions: FindOneOptions<T> | FilterQuery<T> | any): Promise<T | null>;

  /**
   * Find all entities by conditions
   */
  findAll(conditions?: FindManyOptions<T> | FilterQuery<T> | any): Promise<T[]>;

  /**
   * Find entities with pagination
   */
  findAndCountPaginated?(conditions?: FindManyOptions<T> | FilterQuery<T> | any): Promise<{ data: T[]; total: number }>;

  /**
   * Find entities with pagination (Mongoose compatible)
   */
  findAndCount?(conditions?: FindManyOptions<T> | FilterQuery<T> | any): Promise<{ data: T[]; total: number }>;

  /**
   * Update an entity by ID
   */
  updateById(id: string | number, data: UpdateQuery<T> | any): Promise<T | null>;

  /**
   * Update entities by conditions
   */
  updateEntity?(conditions: FilterQuery<T> | any, data: UpdateQuery<T> | any): Promise<any>;

  /**
   * Delete an entity by ID
   */
  deleteById(id: string | number): Promise<boolean>;

  /**
   * Delete entities by conditions
   */
  deleteEntity?(conditions: FilterQuery<T> | any): Promise<any>;

  /**
   * Soft delete an entity by ID (if supported)
   */
  softDeleteById(id: string | number): Promise<boolean>;

  /**
   * Count entities by conditions
   */
  count(conditions?: FilterQuery<T> | any): Promise<number>;

  /**
   * Check if entity exists by conditions
   */
  exists(conditions: FilterQuery<T> | any): Promise<boolean>;
}
