import { Field, ObjectType, ID } from '@nestjs/graphql';
import { BaseModel, Paginated } from 'src/common';

@ObjectType()
export class AuthType extends BaseModel {
  @Field(() => ID, { nullable: true })
  id!: string;

  @Field()
  username!: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  token?: string;
}

@ObjectType()
export class PaginatedAuthType extends Paginated(AuthType) {}
