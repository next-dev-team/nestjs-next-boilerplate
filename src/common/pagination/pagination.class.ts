import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { IPaginationMeta } from './pagination.interface';

export class Pagination<PaginationObject> {
  constructor(
    public readonly message: string,
    /**
     * a list of items to be returned
     */
    public readonly data: PaginationObject[],
    /**
     * associated meta information (e.g., counts)
     */
    public readonly meta: IPaginationMeta
  ) {}
}

export class PaginationResponse<T> {
  @ApiProperty({ example: 'success' })
  message!: string;

  @ApiProperty()
  data!: T[];

  @ApiProperty()
  meta!: IPaginationMeta;
}

export const ApiPaginatedResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  desc: { description?: string } = {}
) =>
  applyDecorators(
    ApiExtraModels(PaginationResponse, dataDto),
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) }
              }
            }
          }
        ]
      },
      description: desc.description
    })
  );
