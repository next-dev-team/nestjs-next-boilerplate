import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseModel {
  @Field({ nullable: true })
  createdBy?: string;
  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
  @Field({ nullable: true })
  updatedBy?: string;
  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
