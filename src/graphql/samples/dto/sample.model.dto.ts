import { Field, ObjectType, ID } from '@nestjs/graphql';
import { BaseModel, Paginated } from 'src/common';
@ObjectType()
class NameTypes {
  @Field()
  firstName!: string;
  @Field()
  lastName!: string;
}
@ObjectType()
export class SampleType extends BaseModel {
  @Field(() => ID)
  id!: string;
  @Field()
  name!: string;
  @Field({ nullable: true })
  startedTime?: string;
  @Field()
  endedTime!: string;
  @Field()
  releasedTime!: string;
  @Field({ nullable: true })
  status?: string;
  @Field()
  nameType!: NameTypes;

  @Field(() => [NameTypes])
  nameTypes!: Array<NameTypes>;
}

@ObjectType()
export class PaginatedSampleType extends Paginated(SampleType) {}
