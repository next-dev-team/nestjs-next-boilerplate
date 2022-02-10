import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';

import { UserRepository } from '@repositories';

/**
 * Scope.REQUEST => This means that NestJS will reinitialize our class for every request.
 */
@Injectable({ scope: Scope.REQUEST })
export class UsersLoaders {
  constructor(@InjectRepository(UserRepository) private readonly userRepo: UserRepository) {}

  private _batchUsers = new DataLoader(async (ids: any) => {
    const users = await this.userRepo.findByIds(ids);
    return ids.map(id => users.find(v => v.id == id) || null);
  });

  public loadBatchUsers(id: string) {
    return this._batchUsers.load(id);
  }
}
