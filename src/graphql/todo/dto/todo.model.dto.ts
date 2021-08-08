import { Field, ObjectType, ID } from '@nestjs/graphql';
import { BaseModel, Paginated } from 'src/common';

@ObjectType()
export class TodoType extends BaseModel {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;
}

@ObjectType()
export class PaginatedTodoType extends Paginated(TodoType) {}
