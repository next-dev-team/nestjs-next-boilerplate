import { ApiResponseProperty } from '@nestjs/swagger';

export interface IPaginationOptions {
  /**
   * the amount of items to be requested per page
   */
  limit: number;
  /**
   * the page that is requested
   */
  page: number;
}

export abstract class IPaginationMeta {
  /**
   * the amount of items on this specific page
   */
  @ApiResponseProperty({ example: 10 })
  itemCount!: number;
  /**
   * the total amount of items
   */
  @ApiResponseProperty({ example: 20 })
  totalItems!: number;
  /**
   * the amount of items that were requested per page
   */
  @ApiResponseProperty({ example: 10 })
  itemsPerPage!: number;
  /**
   * the total amount of pages in this paginator
   */
  @ApiResponseProperty({ example: 5 })
  totalPages!: number;
  /**
   * the current page this paginator "points" to
   */
  @ApiResponseProperty({ example: 1 })
  currentPage!: number;
  /**
   * the indicator shows if we have more page or not
   */
  @ApiResponseProperty({ example: false })
  hasNextPage!: boolean;
  /**
   * the indicator shows if we have prev page or not
   */
  @ApiResponseProperty({ example: true })
  hasPrevPage!: boolean;
  /**
   * the page before the current page
   */
  @ApiResponseProperty({ example: 1 })
  prevPage!: number | null;
  /**
   * the page after the current page
   */
  @ApiResponseProperty({ example: 3 })
  nextPage!: number | null;
}
