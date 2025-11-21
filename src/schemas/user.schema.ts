import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mSchema, Model } from 'mongoose';

import { T } from '@common';
import { BaseCreation } from './base.schema';

export type UserDocument = HydratedDocument<User>;
export type UserModel = Model<UserDocument>;

@Schema({
  timestamps: true,
  collection: 'users',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class User extends BaseCreation {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  })
  email!: string;

  @Prop({
    required: true,
    select: false,
    minlength: 8
  })
  password!: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50,
    index: true
  })
  firstName!: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50,
    index: true
  })
  lastName!: string;

  @Prop({
    type: String,
    enum: Object.values(T.UserRole),
    default: T.UserRole.USER,
    index: true
  })
  role!: T.UserRole;

  @Prop({
    type: String,
    enum: Object.values(T.UserStatus),
    default: T.UserStatus.PENDING_VERIFICATION,
    index: true
  })
  status!: T.UserStatus;

  @Prop({ default: false, index: true })
  isEmailVerified!: boolean;

  @Prop({ select: false, index: true, sparse: true })
  emailVerificationToken?: string;

  @Prop({ select: false, index: true, sparse: true })
  passwordResetToken?: string;

  @Prop({ select: false })
  passwordResetExpires?: Date;

  @Prop({ index: true })
  lastLoginAt?: Date;

  @Prop({ trim: true })
  avatar?: string;

  @Prop({
    trim: true,
    match: /^\+[1-9]\d{1,14}$/,
    index: true,
    sparse: true
  })
  phoneNumber?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({
    type: String,
    enum: Object.values(T.UserGender)
  })
  gender?: T.UserGender;

  @Prop({
    trim: true,
    maxlength: 500
  })
  bio?: string;

  @Prop({
    trim: true,
    default: 'UTC'
  })
  timezone?: string;

  @Prop({
    trim: true,
    lowercase: true,
    default: 'en',
    match: /^[a-z]{2}$/
  })
  language?: string;

  @Prop({
    type: mSchema.Types.Mixed,
    default: {}
  })
  preferences?: Record<string, any>;

  @Prop({
    type: Number,
    default: 0,
    min: 0
  })
  loginCount?: number;

  // Virtual Properties
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

export const UserSchema = SchemaFactory.createForClass(User);

// Comprehensive indexes for performance
UserSchema.index({ email: 1 }, { unique: true }); // Unique email
UserSchema.index({ role: 1, status: 1 }); // Common filter combination
UserSchema.index({ status: 1, isEmailVerified: 1 }); // Active user queries
UserSchema.index({ firstName: 1, lastName: 1 }); // Name-based searches
UserSchema.index({ phoneNumber: 1 }, { sparse: true }); // Phone lookup
UserSchema.index({ createdAt: -1 }); // Recent users
UserSchema.index({ lastLoginAt: -1 }); // Recent logins
UserSchema.index({ loginCount: -1 }); // Most active users
UserSchema.index(
  {
    firstName: 'text',
    lastName: 'text',
    email: 'text',
    bio: 'text'
  },
  {
    weights: {
      firstName: 10,
      lastName: 10,
      email: 8,
      bio: 3
    },
    name: 'user_text_index'
  }
); // Full text search with weights

// Virtual properties
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

UserSchema.virtual('initials').get(function () {
  return `${this.firstName?.[0] || ''}${this.lastName?.[0] || ''}`.toUpperCase();
});

UserSchema.virtual('isAdmin').get(function () {
  return [T.UserRole.ADMIN, T.UserRole.SUPER_ADMIN].includes(this.role);
});

UserSchema.virtual('isActive').get(function () {
  return this.status === T.UserStatus.ACTIVE && this.isEmailVerified;
});

UserSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Transform for JSON serialization
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete (ret as any).__v;
    delete (ret as any).password;
    delete (ret as any).passwordResetToken;
    delete (ret as any).emailVerificationToken;
    delete (ret as any).id; // Remove duplicate _id as id

    // Transform ObjectIds to strings for API responses
    if (ret._id) (ret as any)._id = ret._id.toString();
    if (ret.createdBy) (ret as any).createdBy = ret.createdBy.toString();
    if (ret.updatedBy) (ret as any).updatedBy = ret.updatedBy.toString();

    return ret;
  }
});

// Transform for Object serialization
UserSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    delete (ret as any).__v;
    delete (ret as any).password;
    delete (ret as any).passwordResetToken;
    delete (ret as any).emailVerificationToken;
    return ret;
  }
});
