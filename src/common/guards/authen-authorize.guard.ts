import { UseGuards } from '@nestjs/common';

import { AuthenticateGuard } from './authenticate.guard';
import { AuthorizeGuard } from './authorize.guard';

/**
 * The act of verifying the access rights of a user to interact with a resource.
 * @description https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52
 */
export const AuthenticateAuthorize = () => UseGuards(AuthenticateGuard, AuthorizeGuard);
