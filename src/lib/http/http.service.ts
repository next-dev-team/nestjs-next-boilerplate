import { HttpService as _HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { ConfigService } from '@lib/config';

import { HttpConfigDto } from './http.dto';
import { IRequestSportAPI } from './interface/request.interface';

@Injectable()
export class HttpService {
  constructor(private httpService: _HttpService, private configService: ConfigService) {}
  private readonly config = this.configService.validate('HttpModule', HttpConfigDto);
  async sportRequest(uri: string, params: IRequestSportAPI) {
    const data = { user: this.config.HTTP_API_USER, secret: this.config.HTTP_API_SECRET_KEY, ...params };
    const res = await firstValueFrom(this.httpService.get(uri, { params: data }));
    const result = res.data;
    if (result.status == 'err') throw new BadRequestException(result.message);
    return result;
  }
}
