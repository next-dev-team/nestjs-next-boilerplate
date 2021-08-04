import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SampleDocument } from 'src/repository';

import { Global, T } from '@common';

@Injectable()
export class SamplesService {
  constructor(@InjectModel('Sample') private model: Model<SampleDocument>) {}
  async create(params: any): Promise<any> {
    const createdObj = new this.model({
      ...params,
      nameTypes: params.nameTypes.map(v => {
        return { ...v, _id: Global.getObjectId() };
      }),
      otherId: Global.getObjectId(params.otherId),
      createdAt: new Date()
    });
    return await createdObj.save();
  }
  async update(params: any): Promise<any> {
    const { id, ...newParams } = params;
    return await this.model.findByIdAndUpdate(id, { $set: newParams }, { new: true });
  }
  async findAll(filter: any): Promise<any> {
    const pageFilter = {
      limit: filter.limit,
      offset: (Number(filter.page) - 1) * Number(filter.limit)
    };
    const { page, limit, ...objectFilter } = filter;
    console.log(pageFilter);
    console.log(objectFilter);
    return await this.model
      .aggregate([
        { $match: { ...objectFilter, status: { $in: objectFilter.status } } },
        { $skip: pageFilter.offset },
        { $limit: pageFilter.limit },
        { $sort: { _id: -1 } }
      ])
      .exec();
  }
  async findActive(filter: any): Promise<any> {
    return await this.model.find().exec();
  }
  async count(filter: any): Promise<number> {
    const { limit, page, ...objectFilter } = filter;
    return await this.model
      .find({ ...objectFilter, status: { $in: objectFilter.status } })
      .countDocuments()
      .exec();
  }
  async findOne(filter: any): Promise<any> {
    return await this.model.findOne({
      ...filter,
      status: { $ne: T.StatusEnum.DELETED }
    });
  }
  async delete(id: string): Promise<any> {
    return await this.model.findOneAndDelete({ _id: id });
  }

  async aggregateAll(filter: any): Promise<any> {
    const pageFilter = {
      limit: filter.limit,
      offset: (Number(filter.page) - 1) * Number(filter.limit)
    };
    const { page, limit, ...objectFilter } = filter;
    return await this.model.aggregate([
      { $match: objectFilter },
      { $skip: pageFilter.offset },
      { $limit: pageFilter.limit },
      { $sort: { _id: -1 } }
    ]);
  }
}
