import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  @Get()
  @Redirect('/graphql')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getHello() {}
}
