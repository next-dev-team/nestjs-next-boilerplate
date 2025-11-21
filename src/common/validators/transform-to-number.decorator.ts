import { Transform } from 'class-transformer';

/**
 * Transform string to number
 * @description This is useful for query params that are strings but need to be numbers
 */
export function TransformToNumber() {
  return Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    const num = Number(value);
    return isNaN(num) ? value : num;
  });
}
