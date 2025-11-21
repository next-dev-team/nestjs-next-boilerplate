import { tuple } from './base';

export const RoleEnum = tuple('SUPER_ADMIN', 'ADMIN', 'USER');
export type RoleType = (typeof RoleEnum)[number];

export const StatusEnum = tuple('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED');
export type StatusType = (typeof StatusEnum)[number];

// User enums
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

// Todo enums
export enum TodoStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export enum TodoPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL'
}

export enum TodoCategory {
  PERSONAL = 'PERSONAL',
  WORK = 'WORK',
  PROJECT = 'PROJECT',
  MEETING = 'MEETING',
  RESEARCH = 'RESEARCH',
  BUG_FIX = 'BUG_FIX',
  FEATURE = 'FEATURE',
  OTHER = 'OTHER'
}
