import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { IMetaData } from './response.interface';

export class Response<DataObject> {
  constructor(
    public readonly message: string,

    /**
     * a list of items to be returned
     */
    public readonly data: DataObject,
    /**
     * associated meta information (e.g., counts)
     */
    public readonly meta: IMetaData
  ) {}
}

export class SuccessResponse<T> {
  @ApiProperty({ example: 'success' })
  message?: string;

  @ApiProperty()
  data!: T;

  @ApiProperty({ type: IMetaData })
  meta!: IMetaData;
}

//@ts-ignore
export const ApiSuccessResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  desc: { description?: string } = {}
) =>
  applyDecorators(
    ApiExtraModels(SuccessResponse, dataDto),
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponse) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(dataDto)
              }
            }
          }
        ]
      },
      description: desc.description
    })
  );
