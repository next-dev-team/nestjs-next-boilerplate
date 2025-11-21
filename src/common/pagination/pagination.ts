import { Pagination } from './pagination.class';
import { IPaginationMeta } from './pagination.interface';

/**
 * Pagination helper for response body
 * @see https://github.com/nestjsx/nestjs-typeorm-paginate
 */
export function paginate<T>(items: T[], totalItems: number, currentPage: number, limit: number, custom?: any) {
  const totalPages = Math.ceil(totalItems / limit) || 0;
  const message = 'success';

  const hasPrevPage = currentPage - 1 > 0;
  const prevPage = hasPrevPage ? currentPage - 1 : null;
  const hasNextPage = currentPage < totalPages;
  const nextPage = hasNextPage ? currentPage + 1 : null;

  const meta: IPaginationMeta = {
    totalItems,
    itemCount: items.length,
    itemsPerPage: limit,
    totalPages,
    currentPage,
    hasPrevPage,
    prevPage,
    hasNextPage,
    nextPage
  };

  if (custom) {
    if (custom.hasNextPage) meta.hasNextPage = custom.hasNextPage;
    if (custom.totalPages) meta.totalPages = custom.totalPages;
  }

  return new Pagination(message, items, meta);
}
