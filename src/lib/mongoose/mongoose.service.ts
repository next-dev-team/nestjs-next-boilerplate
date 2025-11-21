import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserModel, UserDocument, Todo, TodoModel, TodoDocument } from '../../schemas';
import { T } from '@common';

@Injectable()
export class MongooseService {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    @InjectModel(Todo.name) private todoModel: TodoModel
  ) {}

  // User operations
  async createUser(userData: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(userData);
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUsersByRole(role: T.UserRole): Promise<UserDocument[]> {
    return this.userModel.find({ role }).exec();
  }

  async findActiveUsers(): Promise<UserDocument[]> {
    return this.userModel
      .find({
        status: T.UserStatus.ACTIVE,
        isEmailVerified: true
      })
      .exec();
  }

  // Todo operations
  async createTodo(todoData: Partial<Todo>): Promise<TodoDocument> {
    return this.todoModel.create(todoData);
  }

  async findTodosByUser(userId: string): Promise<TodoDocument[]> {
    return this.todoModel.find({ assignedTo: userId }).exec();
  }

  async findTodosByStatus(status: T.TodoStatus): Promise<TodoDocument[]> {
    return this.todoModel.find({ status }).exec();
  }

  async findOverdueTodos(): Promise<TodoDocument[]> {
    return this.todoModel
      .find({
        dueDate: { $lt: new Date() },
        status: { $nin: [T.TodoStatus.COMPLETED, T.TodoStatus.CANCELLED] }
      })
      .exec();
  }

  async updateTodoProgress(todoId: string, progress: number): Promise<TodoDocument | null> {
    return this.todoModel.findByIdAndUpdate(todoId, { progress }, { new: true }).exec();
  }

  // Advanced queries
  async searchUsers(searchText: string, limit: number = 10): Promise<UserDocument[]> {
    return this.userModel
      .find({ $text: { $search: searchText } })
      .limit(limit)
      .exec();
  }

  async getTodoStats(userId?: string) {
    const matchStage = userId ? { assignedTo: userId } : {};

    return this.todoModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', T.TodoStatus.COMPLETED] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', T.TodoStatus.PENDING] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', T.TodoStatus.IN_PROGRESS] }, 1, 0] }
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', new Date()] },
                    { $nin: ['$status', [T.TodoStatus.COMPLETED, T.TodoStatus.CANCELLED]] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);
  }
}
