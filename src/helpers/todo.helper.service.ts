import { Injectable } from '@nestjs/common';
import { TodoService } from 'src/graphql/todo/todo.service';

import { SampleHelperInputType, SampleHelperType } from './dto/sample.helper.dto';

@Injectable()
export class TodoHelperService {
  constructor(private sampleSvc: TodoService) {}
  async createSampleTodoHelper(input: SampleHelperInputType): Promise<SampleHelperType> {
    return await this.sampleSvc.findOne({ name: input.name });
  }
}
