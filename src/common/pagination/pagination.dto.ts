import { ApiPropertyOptional } from '@nestjs/swagger';
import { Min } from 'class-validator';

import { TransformToNumber } from '../validators';

export interface IPaginationDto {
  limit: number;
  page: number;
  offset: number;
  // eslint-disable-next-line prettier/prettier
  get getOffset(): number;
}

export class PaginationDto implements IPaginationDto {
  @ApiPropertyOptional({ default: 10, description: 'Limit query data' })
  @Min(1)
  @TransformToNumber() // Don't remove, look the comment above
  readonly limit: number = 10;

  @ApiPropertyOptional({ default: 1, description: 'Page query data' })
  @Min(1)
  @TransformToNumber()
  readonly page: number = 1;

  get getOffset(): number {
    return this.limit * (this.page - 1);
  }

  @ApiPropertyOptional({ default: 0, description: 'Offset query data ' })
  @Min(0)
  @TransformToNumber()
  readonly offset: number = 0;
}
