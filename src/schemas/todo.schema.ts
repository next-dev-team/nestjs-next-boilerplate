import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as mSchema, Model } from 'mongoose';

import { T } from '@common';
import { BaseCreation } from './base.schema';

export type TodoDocument = HydratedDocument<Todo>;
export type TodoModel = Model<TodoDocument>;

@Schema({
  timestamps: true,
  collection: 'todos',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Todo extends BaseCreation {
  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 200,
    index: true
  })
  title!: string;

  @Prop({
    trim: true,
    maxlength: 1000
  })
  description?: string;

  @Prop({
    type: String,
    enum: Object.values(T.TodoStatus),
    default: T.TodoStatus.PENDING,
    index: true
  })
  status!: T.TodoStatus;

  @Prop({
    type: String,
    enum: Object.values(T.TodoPriority),
    default: T.TodoPriority.MEDIUM,
    index: true
  })
  priority!: T.TodoPriority;

  @Prop({
    type: String,
    enum: Object.values(T.TodoCategory),
    default: T.TodoCategory.OTHER,
    index: true
  })
  category!: T.TodoCategory;

  @Prop({ index: true })
  dueDate?: Date;

  @Prop({ index: true })
  completedAt?: Date;

  @Prop({
    type: mSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  })
  assignedTo!: Types.ObjectId;

  @Prop({
    type: [mSchema.Types.ObjectId],
    ref: 'User',
    default: [],
    index: true
  })
  collaborators?: Types.ObjectId[];

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: function (tags: string[]) {
        return tags.length <= 10 && tags.every(tag => tag.length <= 30);
      },
      message: 'Maximum 10 tags allowed, each tag max 30 characters'
    },
    index: true
  })
  tags?: string[];

  @Prop({ default: false, index: true })
  isArchived!: boolean;

  @Prop({
    type: Number,
    min: 0,
    max: 1000
  })
  estimatedHours?: number;

  @Prop({
    type: Number,
    min: 0,
    max: 1000
  })
  actualHours?: number;

  @Prop({
    type: Number,
    min: 0,
    max: 100,
    default: 0
  })
  progress?: number;

  @Prop({
    trim: true,
    maxlength: 500
  })
  notes?: string;

  @Prop({
    type: mSchema.Types.ObjectId,
    ref: 'Todo',
    index: true
  })
  parentId?: Types.ObjectId;

  @Prop({
    type: mSchema.Types.Mixed,
    default: {}
  })
  metadata?: Record<string, any>;

  // Virtual Properties
  get isOverdue(): boolean {
    if (!this.dueDate || this.status === T.TodoStatus.COMPLETED) return false;
    return new Date() > new Date(this.dueDate);
  }

  get daysUntilDue(): number | null {
    if (!this.dueDate) return null;
    const today = new Date();
    const due = new Date(this.dueDate);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  get isHighPriority(): boolean {
    return [T.TodoPriority.HIGH, T.TodoPriority.URGENT, T.TodoPriority.CRITICAL].includes(this.priority);
  }

  get efficiency(): number | null {
    if (!this.estimatedHours || !this.actualHours) return null;
    return this.estimatedHours / this.actualHours;
  }

  get displayTitle(): string {
    const progressStr = this.progress ? ` (${this.progress}%)` : '';
    return `${this.title}${progressStr}`;
  }
}

export const TodoSchema = SchemaFactory.createForClass(Todo);

// Comprehensive indexes for performance
TodoSchema.index({ assignedTo: 1, status: 1 }); // Most common query pattern
TodoSchema.index({ status: 1, priority: 1 }); // Status with priority filtering
TodoSchema.index({ category: 1, status: 1 }); // Category-based filtering
TodoSchema.index({ dueDate: 1, status: 1 }); // Due date queries
TodoSchema.index({ priority: 1, dueDate: 1 }); // Priority with due date
TodoSchema.index({ isArchived: 1, createdAt: -1 }); // Non-archived recent todos
TodoSchema.index({ tags: 1 }); // Tag-based search
TodoSchema.index({ parentId: 1 }, { sparse: true }); // Subtask queries
TodoSchema.index({ collaborators: 1 }); // Collaborator queries
TodoSchema.index({ createdAt: -1 }); // Recent todos
TodoSchema.index(
  {
    title: 'text',
    description: 'text',
    notes: 'text',
    tags: 'text'
  },
  {
    weights: {
      title: 10,
      description: 5,
      tags: 8,
      notes: 3
    },
    name: 'todo_text_index'
  }
); // Full text search with weights

// Virtual population for assigned user and collaborators
TodoSchema.virtual('assignedUser', {
  ref: 'User',
  localField: 'assignedTo',
  foreignField: '_id',
  justOne: true
});

TodoSchema.virtual('collaboratorUsers', {
  ref: 'User',
  localField: 'collaborators',
  foreignField: '_id'
});

TodoSchema.virtual('parentTodo', {
  ref: 'Todo',
  localField: 'parentId',
  foreignField: '_id',
  justOne: true
});

TodoSchema.virtual('subtasks', {
  ref: 'Todo',
  localField: '_id',
  foreignField: 'parentId'
});

// Virtual properties
TodoSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate || this.status === T.TodoStatus.COMPLETED) return false;
  return new Date() > new Date(this.dueDate);
});

TodoSchema.virtual('daysUntilDue').get(function () {
  if (!this.dueDate) return null;
  const today = new Date();
  const due = new Date(this.dueDate);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
});

TodoSchema.virtual('isHighPriority').get(function () {
  return [T.TodoPriority.HIGH, T.TodoPriority.URGENT, T.TodoPriority.CRITICAL].includes(this.priority);
});

TodoSchema.virtual('efficiency').get(function () {
  if (!this.estimatedHours || !this.actualHours) return null;
  return this.estimatedHours / this.actualHours;
});

TodoSchema.virtual('displayTitle').get(function () {
  const progressStr = this.progress ? ` (${this.progress}%)` : '';
  return `${this.title}${progressStr}`;
});

// Pre-save middleware
TodoSchema.pre('save', function (next) {
  // Auto-set completedAt when status changes to COMPLETED
  if (this.isModified('status')) {
    if (this.status === T.TodoStatus.COMPLETED && !this.completedAt) {
      this.completedAt = new Date();
      this.progress = 100;
    } else if (this.status !== T.TodoStatus.COMPLETED) {
      this.completedAt = undefined;
    }
  }

  // Auto-update progress based on status
  if (this.isModified('status') && !this.isModified('progress')) {
    switch (this.status) {
      case T.TodoStatus.PENDING:
        this.progress = 0;
        break;
      case T.TodoStatus.IN_PROGRESS:
        if (!this.progress || this.progress === 0) {
          this.progress = 25;
        }
        break;
      case T.TodoStatus.COMPLETED:
        this.progress = 100;
        break;
      case T.TodoStatus.CANCELLED:
        // Keep current progress
        break;
    }
  }

  // Validate business rules
  if (this.actualHours && this.estimatedHours && this.actualHours > this.estimatedHours * 3) {
    console.warn(`Todo ${this.title} took significantly longer than estimated`);
  }

  // Prevent circular parent references
  if (this.parentId && this.parentId.toString() === this._id?.toString()) {
    return next(new Error('Todo cannot be its own parent'));
  }

  next();
});

// Post-save middleware
TodoSchema.post('save', function (doc) {
  console.log(`Todo "${doc.title}" was ${this.isNew ? 'created' : 'updated'} with status: ${doc.status}`);
});

// Custom static methods
TodoSchema.statics.findByUser = function (userId: Types.ObjectId, includeCollaborations = false) {
  const query: any = includeCollaborations
    ? { $or: [{ assignedTo: userId }, { collaborators: userId }] }
    : { assignedTo: userId };

  return this.find(query).sort({ priority: -1, dueDate: 1, createdAt: -1 });
};

TodoSchema.statics.findOverdue = function () {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $nin: [T.TodoStatus.COMPLETED, T.TodoStatus.CANCELLED] },
    isArchived: false
  }).sort({ dueDate: 1 });
};

TodoSchema.statics.findByPriority = function (priority: T.TodoPriority) {
  return this.find({
    priority,
    status: { $ne: T.TodoStatus.COMPLETED },
    isArchived: false
  }).sort({ dueDate: 1, createdAt: -1 });
};

TodoSchema.statics.findByCategory = function (category: T.TodoCategory) {
  return this.find({
    category,
    isArchived: false
  }).sort({ priority: -1, dueDate: 1 });
};

TodoSchema.statics.searchByText = function (searchText: string, limit = 10) {
  return this.find(
    {
      $text: { $search: searchText },
      isArchived: false
    },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit);
};

TodoSchema.statics.getStats = function (userId?: Types.ObjectId) {
  const matchStage = userId ? { $match: { assignedTo: userId, isArchived: false } } : { $match: { isArchived: false } };

  return this.aggregate([
    matchStage,
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', T.TodoStatus.COMPLETED] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', T.TodoStatus.PENDING] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', T.TodoStatus.IN_PROGRESS] }, 1, 0] } },
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
        },
        highPriority: {
          $sum: {
            $cond: [
              {
                $in: ['$priority', [T.TodoPriority.HIGH, T.TodoPriority.URGENT, T.TodoPriority.CRITICAL]]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
};

// Instance methods
TodoSchema.methods.addCollaborator = function (userId: Types.ObjectId) {
  if (!this.collaborators) this.collaborators = [];
  if (!this.collaborators.includes(userId)) {
    this.collaborators.push(userId);
  }
  return this.save();
};

TodoSchema.methods.removeCollaborator = function (userId: Types.ObjectId) {
  if (this.collaborators) {
    this.collaborators = this.collaborators.filter(id => !id.equals(userId));
  }
  return this.save();
};

TodoSchema.methods.updateProgress = function (progress: number) {
  if (progress < 0 || progress > 100) {
    throw new Error('Progress must be between 0 and 100');
  }
  this.progress = progress;

  // Auto-update status based on progress
  if (progress === 0 && this.status === T.TodoStatus.IN_PROGRESS) {
    this.status = T.TodoStatus.PENDING;
  } else if (progress > 0 && progress < 100 && this.status === T.TodoStatus.PENDING) {
    this.status = T.TodoStatus.IN_PROGRESS;
  } else if (progress === 100 && this.status !== T.TodoStatus.COMPLETED) {
    this.status = T.TodoStatus.COMPLETED;
    this.completedAt = new Date();
  }

  return this.save();
};

TodoSchema.methods.archive = function () {
  this.isArchived = true;
  return this.save();
};

TodoSchema.methods.unarchive = function () {
  this.isArchived = false;
  return this.save();
};

// Transform for JSON serialization
TodoSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete (ret as any).__v;
    delete (ret as any).id; // Remove duplicate _id as id

    // Transform ObjectIds to strings for API responses
    if (ret._id) (ret as any)._id = ret._id.toString();
    if (ret.assignedTo) (ret as any).assignedTo = ret.assignedTo.toString();
    if (ret.parentId) (ret as any).parentId = ret.parentId.toString();
    if (ret.createdBy) (ret as any).createdBy = ret.createdBy.toString();
    if (ret.updatedBy) (ret as any).updatedBy = ret.updatedBy.toString();
    if (ret.collaborators) {
      (ret as any).collaborators = ret.collaborators.map((id: Types.ObjectId) => id.toString());
    }

    return ret;
  }
});

// Transform for Object serialization
TodoSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    delete (ret as any).__v;
    return ret;
  }
});
