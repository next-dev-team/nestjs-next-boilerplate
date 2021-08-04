import { NotFoundException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SamplesHelperService } from 'src/helpers/samples.helper.service';

import { GetUser } from '@common';

import { SampleFilter, SampleInput, SampleUpdate } from './dto/sample.input.dto';
import { PaginatedSampleType, SampleType } from './dto/sample.model.dto';
import { SamplesService } from './samples.service';

@Resolver()
export class SamplesResolver {
  constructor(private readonly service: SamplesService, private sampleHelperSvc: SamplesHelperService) {}
  @Mutation(() => SampleType)
  async createSample(@Args('input') input: SampleInput): Promise<any> {
    console.log(this.sampleHelperSvc);
    // const doc = await this.sampleHelperSvc.createSampleHelper({ name: input.name });
    // console.log('result of time helper:', doc.name);
    return await this.service.create({ ...input });
  }
  @Mutation(() => SampleType)
  async updateSample(@GetUser() { _id: userId }, @Args('input') input: SampleUpdate): Promise<any> {
    return this.service.update({ ...input, updatedBy: userId });
  }
  @Mutation(() => SampleType)
  async deleteSample(@Args('id') id: string): Promise<any> {
    const doc = await this.service.delete(id);
    if (!doc) return new NotFoundException('Record not found');
    return doc;
  }
  @Query(() => SampleType)
  async getSample(@Args('filter') filter: SampleFilter): Promise<any> {
    const doc = await this.service.findOne(filter);
    if (!doc) return new NotFoundException('Record not found');
    return doc;
  }
  @Query(() => PaginatedSampleType)
  async getSamples(@Args('filter') filter: SampleFilter): Promise<PaginatedSampleType> {
    const records = await this.service.findAll(filter);
    const total = await this.service.count(filter);
    return {
      records,
      metadata: { limit: filter.limit, page: filter.page, total }
    };
  }
  @Query(() => [SampleType])
  async getActiveSamples(@Args('filter') filter: SampleFilter): Promise<any[]> {
    return await this.service.findActive(filter);
  }
}
