import { HttpModule as _HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { ConfigService } from '@lib/config';

import { HttpConfigDto } from './http.dto';
import { HttpService } from './http.service';

@Global()
@Module({
  exports: [_HttpModule, HttpService],
  imports: [
    _HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = configService.validate('HttpModule', HttpConfigDto);
        return {
          baseURL: config.HTTP_REQUEST_ENDPOINT
        };
      }
    })
  ],
  providers: [HttpService]
})
export class HttpModule {}
