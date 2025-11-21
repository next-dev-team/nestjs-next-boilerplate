export { AppExceptionFilter } from './exceptions/app-exception-filter';

/*
|--------------------------------------------------------------------------
| Types / Enum
|--------------------------------------------------------------------------
*/
// eslint-disable-next-line prettier/prettier
export * as T from './types';
export { Translate } from './types';

/*
|--------------------------------------------------------------------------
| utils
|--------------------------------------------------------------------------
*/
export * as UTIL from './utils';

/*
|--------------------------------------------------------------------------
| Guards
|--------------------------------------------------------------------------
*/
export { Authenticate, AuthenticateGuard } from './guards/authenticate.guard';

/*
|--------------------------------------------------------------------------
| Decorators
|--------------------------------------------------------------------------
*/
export { GetUser } from './decorators/get-user.decorator';
export { Public } from './decorators/public.decorator';
export { Roles } from './decorators/roles.decorator';
export { IXAuthUser } from './decorators/interfaces';

/*
|--------------------------------------------------------------------------
| Swagger
|--------------------------------------------------------------------------
*/
export { swaggerOptions } from './swaggers/swagger.config';
export { swaggerDescription } from './swaggers/swagger.description';
export { operationsSorter, CaseInsensitiveFilterPlugin, CustomLayoutPlugin } from './swaggers/swagger.plugin';

/*
|--------------------------------------------------------------------------
| Interceptors
|--------------------------------------------------------------------------
*/
export { LoggingInterceptor } from './interceptors/logging.interceptor';
export { TransformInterceptor } from './interceptors/transform.interceptor';

/*
|--------------------------------------------------------------------------
| Response intercept
|--------------------------------------------------------------------------
*/
export { Response, IMetaData, ApiSuccessResponse, SuccessResponse, successResponse } from './responses';
export {
  IPaginationMeta,
  PaginationDto,
  IPaginationDto,
  Pagination,
  paginate,
  ApiPaginatedResponse,
  PaginationResponse
} from './pagination';

/*
|--------------------------------------------------------------------------
| Validator
|--------------------------------------------------------------------------
*/
export { TransformToNumber } from './validators';
