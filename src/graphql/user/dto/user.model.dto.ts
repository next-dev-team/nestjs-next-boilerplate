import { Field, ObjectType, ID } from '@nestjs/graphql';
import { BaseModel, Paginated } from 'src/common';

@ObjectType()
export class UserType extends BaseModel {
  @Field(() => ID)
  id!: string;

  @Field()
  username!: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  token?: string;
}

@ObjectType()
export class PaginatedUserType extends Paginated(UserType) {}
