import { Response } from './response.class';
import { IMetaData } from './response.interface';

export function successResponse<T>(item: T, meta: IMetaData = {}) {
  const message = 'success';
  return new Response(message, item, meta);
}
