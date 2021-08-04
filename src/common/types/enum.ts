import { registerEnumType } from '@nestjs/graphql';

export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}

registerEnumType(StatusEnum, { name: 'StatusEnum' });
