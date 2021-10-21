import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from '@schemas';
import { Model } from 'mongoose';

import { BaseService } from '@lib/mongoose/base.service';

@Injectable()
export class TodoService extends BaseService<TodoDocument> {
  constructor(@InjectModel(Todo.name) readonly model: Model<TodoDocument>) {
    super(model);
  }
}
