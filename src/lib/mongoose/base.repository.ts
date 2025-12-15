import { Model, FilterQuery, UpdateQuery, Document } from 'mongoose';

/**
 * Base MongoDB Repository using Mongoose
 * Compatible with IBaseRepository interface for Mongoose models
 */
export class MongoBaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<T> {
    const created = new this.model(data);
    return created.save() as Promise<T>;
  }

  /**
   * Create multiple documents
   */
  async createMany(data: Partial<T>[]): Promise<T[]> {
    const result = await this.model.insertMany(data as any);
    return result as T[];
  }

  /**
   * Find one document by ID
   */
  async findById(id: string | number): Promise<T | null> {
    return this.model.findById(id).exec() as Promise<T | null>;
  }

  /**
   * Find one document by conditions
   */
  async findOne(conditions: FilterQuery<T> | any): Promise<T | null> {
    // Handle TypeORM-style FindOneOptions
    if (conditions.where) {
      const { where, select, relations, order } = conditions;
      let query = this.model.findOne(where as FilterQuery<T>);

      if (select) {
        query = query.select(select);
      }

      if (relations) {
        relations.forEach((relation: string) => {
          query = query.populate(relation);
        });
      }

      if (order) {
        query = query.sort(order);
      }

      return query.exec() as Promise<T | null>;
    }

    return this.model.findOne(conditions as FilterQuery<T>).exec() as Promise<T | null>;
  }

  /**
   * Find all documents by conditions
   */
  async findAll(conditions?: FilterQuery<T> | any): Promise<T[]> {
    if (!conditions) {
      return this.model.find().exec() as Promise<T[]>;
    }

    // Handle TypeORM-style FindManyOptions
    if (
      conditions.where ||
      conditions.select ||
      conditions.relations ||
      conditions.order ||
      conditions.skip ||
      conditions.take
    ) {
      const { where, select, relations, order, skip, take } = conditions;
      let query = this.model.find((where || {}) as FilterQuery<T>);

      if (select) {
        query = query.select(select);
      }

      if (relations) {
        relations.forEach((relation: string) => {
          query = query.populate(relation);
        });
      }

      if (order) {
        query = query.sort(order);
      }

      if (skip !== undefined) {
        query = query.skip(skip);
      }

      if (take !== undefined) {
        query = query.limit(take);
      }

      return query.exec() as Promise<T[]>;
    }

    return this.model.find(conditions as FilterQuery<T>).exec() as Promise<T[]>;
  }

  /**
   * Find documents with pagination
   */
  async findAndCount(conditions?: FilterQuery<T> | any): Promise<{ data: T[]; total: number }> {
    let filter: FilterQuery<T> = {};

    // Handle TypeORM-style FindManyOptions
    if (
      conditions?.where ||
      conditions?.select ||
      conditions?.relations ||
      conditions?.order ||
      conditions?.skip ||
      conditions?.take
    ) {
      const { where, select, relations, order, skip, take } = conditions;
      filter = (where || {}) as FilterQuery<T>;

      let query = this.model.find(filter);

      if (select) {
        query = query.select(select);
      }

      if (relations) {
        relations.forEach((relation: string) => {
          query = query.populate(relation);
        });
      }

      if (order) {
        query = query.sort(order);
      }

      if (skip !== undefined) {
        query = query.skip(skip);
      }

      if (take !== undefined) {
        query = query.limit(take);
      }

      const [data, total] = await Promise.all([query.exec() as Promise<T[]>, this.model.countDocuments(filter).exec()]);

      return { data, total };
    }

    // Handle plain filter query
    filter = (conditions || {}) as FilterQuery<T>;

    const [data, total] = await Promise.all([
      this.model.find(filter).exec() as Promise<T[]>,
      this.model.countDocuments(filter).exec()
    ]);

    return { data, total };
  }

  /**
   * Update a document by ID
   */
  async updateById(id: string | number, data: UpdateQuery<T> | any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec() as Promise<T | null>;
  }

  /**
   * Update documents by conditions
   */
  async update(conditions: FilterQuery<T> | any, data: UpdateQuery<T> | any): Promise<any> {
    const result = await this.model.updateMany(conditions as FilterQuery<T>, data).exec();
    return {
      affected: result.modifiedCount,
      raw: result
    };
  }

  /**
   * Delete a document by ID
   */
  async deleteById(id: string | number): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return !!result;
  }

  /**
   * Delete documents by conditions
   */
  async delete(conditions: FilterQuery<T> | any): Promise<any> {
    const result = await this.model.deleteMany(conditions as FilterQuery<T>).exec();
    return {
      affected: result.deletedCount,
      raw: result
    };
  }

  /**
   * Soft delete a document by ID
   */
  async softDeleteById(id: string | number): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(id, { deletedAt: new Date() } as any, { new: true }).exec();
    return !!result;
  }

  /**
   * Count documents by conditions
   */
  async count(conditions?: FilterQuery<T> | any): Promise<number> {
    return this.model.countDocuments((conditions || {}) as FilterQuery<T>).exec();
  }

  /**
   * Check if document exists by conditions
   */
  async exists(conditions: FilterQuery<T> | any): Promise<boolean> {
    const count = await this.model
      .countDocuments(conditions as FilterQuery<T>)
      .limit(1)
      .exec();
    return count > 0;
  }
}
