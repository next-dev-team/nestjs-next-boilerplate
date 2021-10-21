import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@schemas';
import { Model } from 'mongoose';

import { BaseService } from '@lib/mongoose/base.service';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(@InjectModel(User.name) readonly model: Model<UserDocument>) {
    super(model);
  }
}
