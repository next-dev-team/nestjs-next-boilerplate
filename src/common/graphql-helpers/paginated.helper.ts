import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export function Paginated<T, U>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginated<T> {
    @Field(() => [classRef], { nullable: true })
    records!: T[];

    @Field(() => Metadata, { nullable: true })
    metadata!: Metadata;
  }
  return PaginatedType as any;
}

interface IPaginated<T> {
  records: T[];
  metadata: Metadata;
}

@ObjectType()
class Metadata {
  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  page!: number;
}
