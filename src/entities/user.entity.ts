import { Entity, Column, Index, OneToMany } from 'typeorm';

import { T } from '@common';
import { BaseEntity } from './base.entity';
import { TodoEntity } from './todo.entity';

@Entity('users')
@Index(['email'])
@Index(['firstName'])
@Index(['lastName'])
@Index(['role'])
@Index(['status'])
@Index(['isEmailVerified'])
@Index(['lastLoginAt'])
@Index(['phoneNumber'])
@Index(['loginCount'])
@Index(['role', 'status'])
@Index(['status', 'isEmailVerified'])
@Index(['firstName', 'lastName'])
export class UserEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
    transformer: {
      to: (value: string) => value?.toLowerCase().trim(),
      from: (value: string) => value
    }
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false
  })
  password!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  firstName!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  lastName!: string;

  @Column({
    type: 'enum',
    enum: T.UserRole,
    default: T.UserRole.USER
  })
  role!: T.UserRole;

  @Column({
    type: 'enum',
    enum: T.UserStatus,
    default: T.UserStatus.PENDING_VERIFICATION
  })
  status!: T.UserStatus;

  @Column({
    type: 'boolean',
    default: false
  })
  isEmailVerified!: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false
  })
  emailVerificationToken?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false
  })
  passwordResetToken?: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
    select: false
  })
  passwordResetExpires?: Date;

  @Column({
    type: 'timestamptz',
    nullable: true
  })
  lastLoginAt?: Date;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true
  })
  avatar?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true
  })
  phoneNumber?: string;

  @Column({
    type: 'date',
    nullable: true
  })
  dateOfBirth?: Date;

  @Column({
    type: 'enum',
    enum: T.UserGender,
    nullable: true
  })
  gender?: T.UserGender;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true
  })
  bio?: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'UTC'
  })
  timezone?: string;

  @Column({
    type: 'varchar',
    length: 2,
    default: 'en'
  })
  language?: string;

  @Column({
    type: 'jsonb',
    default: {}
  })
  preferences?: Record<string, any>;

  @Column({
    type: 'integer',
    default: 0
  })
  loginCount?: number;

  // Relations
  @OneToMany(() => TodoEntity, todo => todo.assignedToUser)
  assignedTodos?: TodoEntity[];

  @OneToMany(() => TodoEntity, todo => todo.parent)
  todos?: TodoEntity[];

  // Virtual Properties (can be used as getters)
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get initials(): string {
    return `${this.firstName?.[0] || ''}${this.lastName?.[0] || ''}`.toUpperCase();
  }

  get isAdmin(): boolean {
    return [T.UserRole.ADMIN, T.UserRole.SUPER_ADMIN].includes(this.role);
  }

  get isActive(): boolean {
    return this.status === T.UserStatus.ACTIVE && this.isEmailVerified;
  }

  get age(): number | null {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
