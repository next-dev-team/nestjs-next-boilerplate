import { Injectable } from '@nestjs/common';
import * as Bcrypt from 'bcrypt';

@Injectable()
export class PwdService {
  async createPwd(str) {
    return await Bcrypt.hash(str, 11);
  }

  async verifyPwd(str, hash) {
    return await Bcrypt.compare(str, hash);
  }
}
