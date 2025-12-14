import { Entity, Column, Index, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';

import { T } from '@common';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('todos')
@Index(['title'])
@Index(['status'])
@Index(['priority'])
@Index(['category'])
@Index(['dueDate'])
@Index(['completedAt'])
@Index(['assignedTo'])
@Index(['isArchived'])
@Index(['parentId'])
@Index(['tags'])
export class TodoEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 200,
    nullable: false
  })
  title!: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: true
  })
  description?: string;

  @Column({
    type: 'enum',
    enum: T.TodoStatus,
    default: T.TodoStatus.PENDING
  })
  status!: T.TodoStatus;

  @Column({
    type: 'enum',
    enum: T.TodoPriority,
    default: T.TodoPriority.MEDIUM
  })
  priority!: T.TodoPriority;

  @Column({
    type: 'enum',
    enum: T.TodoCategory,
    default: T.TodoCategory.OTHER
  })
  category!: T.TodoCategory;

  @Column({
    type: 'timestamptz',
    nullable: true
  })
  dueDate?: Date;

  @Column({
    type: 'timestamptz',
    nullable: true
  })
  completedAt?: Date;

  @Column({
    type: 'integer',
    nullable: false
  })
  assignedTo!: number;

  @Column({
    type: 'simple-array',
    nullable: true
  })
  tags?: string[];

  @Column({
    type: 'boolean',
    default: false
  })
  isArchived!: boolean;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true
  })
  estimatedHours?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true
  })
  actualHours?: number;

  @Column({
    type: 'integer',
    default: 0
  })
  progress?: number;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true
  })
  notes?: string;

  @Column({
    type: 'integer',
    nullable: true
  })
  parentId?: number;

  @Column({
    type: 'jsonb',
    default: {}
  })
  metadata?: Record<string, any>;

  // Relations
  @ManyToOne(() => UserEntity, user => user.assignedTodos)
  @JoinColumn({ name: 'assignedTo' })
  assignedToUser?: UserEntity;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'todo_collaborators',
    joinColumn: { name: 'todoId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
  })
  collaborators?: UserEntity[];

  @ManyToOne(() => TodoEntity, todo => todo.children)
  @JoinColumn({ name: 'parentId' })
  parent?: TodoEntity;

  @ManyToOne(() => TodoEntity, todo => todo.parent)
  children?: TodoEntity[];

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
    if (!this.estimatedHours || !this.actualHours || this.actualHours === 0) return null;
    return Number(this.estimatedHours) / Number(this.actualHours);
  }

  get displayTitle(): string {
    return `${this.title} (${this.progress}%)`;
  }
}
