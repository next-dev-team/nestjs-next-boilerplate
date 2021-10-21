import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { t } from 'typy';

import { T } from '@common';

/**
 * Abstract base service that other services can extend to provide base CRUD
 * functionality such as to create, find, update and delete data.
 */
@Injectable()
export abstract class BaseService<T> {
  /**
   * The constructor must receive the injected model from the child service in
   * order to provide all the proper base functionality.
   *
   * @param {Model} model - The injected model.
   */
  constructor(readonly model: Model<T>) {
    // Services who extend this service already contain a property called
    // 'logger' so we will assign it to a different name.

    for (const modelName of Object.keys(model.collection.conn.models)) {
      if (model.collection.conn.models[modelName] === this.model) {
        break;
      }
    }
  }

  /**
   * create one or many by default function of mongoose
   * @param params
   * @returns
   */
  async create(params: Partial<Record<keyof T, unknown>> | Partial<Record<keyof T, unknown>>[]): Promise<T> {
    return await this.model.create(params);
  }

  /**
   * find by id and update is default method of mongoose
   * @param params
   * @returns
   */
  async update(params: Partial<Record<keyof T, unknown>>): Promise<T | null> {
    const { id } = params as any;
    return await this.model.findByIdAndUpdate(id, params as UpdateQuery<T>, { new: true });
  }

  /**
   * Find one entry and return the result.
   *
   * @throws InternalServerErrorException
   */
  async findOne(
    filters: Partial<Record<keyof T, unknown>>,
    projection: string | Record<string, unknown> = {},
    options: Record<string, unknown> = {}
  ): Promise<T | null> {
    return await this.model.findOne(
      { ...filters, status: { $ne: T.StatusEnum.DELETED } } as FilterQuery<T>,
      projection,
      options
    );
  }

  /**
   * get active documents
   * @param filter
   * @returns
   */

  async findActive(
    filters: Partial<Record<keyof T, unknown>>,
    sort: Record<string, -1 | 1> = { _id: -1 }
  ): Promise<any> {
    return await this.model
      .find({ ...filters, status: T.StatusEnum.ACTIVE } as FilterQuery<T>)
      .sort({ ...sort })
      .exec();
  }

  /**
   * get documents with pagination
   * @param filter
   * @returns
   */
  async getPaginatedList(
    filters: Partial<Record<keyof T, unknown>>,
    sort: Record<string, -1 | 1> = { _id: -1 }
  ): Promise<{ records: Record<string, unknown>[]; metadata: { limit: number; page: number; total: number } }> {
    const { limit, page, status, ...newFilters } = filters as any;
    const pageFilter = {
      limit: limit || 10,
      page: page || 1,
      offset: (Number(page || 1) - 1) * Number(limit || 10)
    };
    // assign default status
    newFilters.status = { $ne: T.StatusEnum.DELETED };
    if (status) {
      if (t(status).safeArray.length) {
        newFilters.status = { $in: status };
      } else {
        newFilters.status = status;
      }
    }
    const docs = await this.model.aggregate([
      {
        $facet: {
          records: [
            { $match: { ...newFilters } },
            { $sort: { ...sort } },
            { $skip: pageFilter.offset },
            { $limit: pageFilter.limit }
          ],
          pageInfo: [{ $group: { _id: 'null', total: { $sum: 1 } } }]
        }
      }
    ]);
    const records = t(docs, '0.records').safeArray;
    return {
      records: records.length ? (records.map(v => this.model.hydrate(v)) as any) : [],
      metadata: { limit: pageFilter.limit, page: pageFilter.page, total: t(docs, '0.pageInfo[0].total').safeNumber }
    };
  }

  /**
   * hard delete
   * @param id
   * @returns
   */
  async hardDelete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * soft delete
   * @param id
   * @returns
   */
  async softDelete(id: string): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, { status: T.StatusEnum.DELETED } as any);
  }
}
