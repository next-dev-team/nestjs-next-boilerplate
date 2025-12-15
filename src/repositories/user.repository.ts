import { Injectable } from '@nestjs/common';
import { DataSource, Brackets } from 'typeorm';

import { UserEntity } from '@entities';
import { BaseRepository } from '@lib/typeorm/base.repository';
import { T } from '@common';

/**
 * Enhanced User Repository with custom methods prefixed with $
 * Provides advanced query capabilities and business logic for user operations
 */
@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }

  /**
   * Find user by email (case-insensitive)
   * @param email - User email address
   */
  async $findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({
      where: { email: email.toLowerCase() }
    });
  }

  /**
   * Find user by email with password field included
   * @param email - User email address
   */
  async $findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return this.createQueryBuilder('user')
      .where('user.email = :email', { email: email.toLowerCase() })
      .addSelect('user.password')
      .getOne();
  }

  /**
   * Find user by ID with all sensitive fields
   * @param userId - User ID
   */
  async $findByIdWithSensitiveData(userId: number): Promise<UserEntity | null> {
    return this.createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .addSelect('user.password')
      .addSelect('user.emailVerificationToken')
      .addSelect('user.passwordResetToken')
      .addSelect('user.passwordResetExpires')
      .getOne();
  }

  /**
   * Search users by name, email, or phone number
   * @param searchTerm - Search term to match against user fields
   * @param options - Additional search options
   */
  async $searchUsers(
    searchTerm: string,
    options?: {
      role?: T.UserRole;
      status?: T.UserStatus;
      isEmailVerified?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ users: UserEntity[]; total: number }> {
    const query = this.createQueryBuilder('user');

    // Search across multiple fields
    query.where(
      new Brackets(qb => {
        qb.where('user.email ILIKE :search', { search: `%${searchTerm}%` })
          .orWhere('user.firstName ILIKE :search', { search: `%${searchTerm}%` })
          .orWhere('user.lastName ILIKE :search', { search: `%${searchTerm}%` })
          .orWhere('user.phoneNumber ILIKE :search', { search: `%${searchTerm}%` });
      })
    );

    // Apply filters
    if (options?.role) {
      query.andWhere('user.role = :role', { role: options.role });
    }

    if (options?.status) {
      query.andWhere('user.status = :status', { status: options.status });
    }

    if (options?.isEmailVerified !== undefined) {
      query.andWhere('user.isEmailVerified = :isEmailVerified', {
        isEmailVerified: options.isEmailVerified
      });
    }

    // Pagination
    if (options?.limit) {
      query.take(options.limit);
    }

    if (options?.offset) {
      query.skip(options.offset);
    }

    query.orderBy('user.createdAt', 'DESC');

    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }

  /**
   * Find users by role with optional status filter
   * @param role - User role
   * @param status - Optional user status filter
   */
  async $findByRole(role: T.UserRole, status?: T.UserStatus): Promise<UserEntity[]> {
    const query = this.createQueryBuilder('user').where('user.role = :role', { role });

    if (status) {
      query.andWhere('user.status = :status', { status });
    }

    return query.orderBy('user.createdAt', 'DESC').getMany();
  }

  /**
   * Find users by status
   * @param status - User status
   */
  async $findByStatus(status: T.UserStatus): Promise<UserEntity[]> {
    return this.find({
      where: { status },
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Get user statistics
   */
  async $getStatistics(): Promise<{
    total: number;
    byRole: Record<T.UserRole, number>;
    byStatus: Record<T.UserStatus, number>;
    verified: number;
    unverified: number;
    activeToday: number;
    newThisMonth: number;
  }> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      total,
      userRoleCount,
      adminRoleCount,
      superAdminRoleCount,
      activeStatusCount,
      inactiveStatusCount,
      suspendedStatusCount,
      pendingStatusCount,
      verified,
      unverified,
      activeToday,
      newThisMonth
    ] = await Promise.all([
      this.count(),
      this.count({ role: T.UserRole.USER } as any),
      this.count({ role: T.UserRole.ADMIN } as any),
      this.count({ role: T.UserRole.SUPER_ADMIN } as any),
      this.count({ status: T.UserStatus.ACTIVE } as any),
      this.count({ status: T.UserStatus.INACTIVE } as any),
      this.count({ status: T.UserStatus.SUSPENDED } as any),
      this.count({ status: T.UserStatus.PENDING_VERIFICATION } as any),
      this.count({ isEmailVerified: true } as any),
      this.count({ isEmailVerified: false } as any),
      this.createQueryBuilder('user').where('user.lastLoginAt >= :today', { today }).getCount(),
      this.createQueryBuilder('user').where('user.createdAt >= :firstDayOfMonth', { firstDayOfMonth }).getCount()
    ]);

    return {
      total,
      byRole: {
        [T.UserRole.USER]: userRoleCount,
        [T.UserRole.ADMIN]: adminRoleCount,
        [T.UserRole.SUPER_ADMIN]: superAdminRoleCount
      },
      byStatus: {
        [T.UserStatus.ACTIVE]: activeStatusCount,
        [T.UserStatus.INACTIVE]: inactiveStatusCount,
        [T.UserStatus.SUSPENDED]: suspendedStatusCount,
        [T.UserStatus.PENDING_VERIFICATION]: pendingStatusCount
      },
      verified,
      unverified,
      activeToday,
      newThisMonth
    };
  }

  /**
   * Update user last login information
   * @param userId - User ID
   */
  async $updateLastLogin(userId: number): Promise<void> {
    await this.createQueryBuilder()
      .update(UserEntity)
      .set({
        lastLoginAt: new Date(),
        loginCount: () => 'login_count + 1'
      })
      .where('id = :userId', { userId })
      .execute();
  }

  /**
   * Verify user email
   * @param userId - User ID
   */
  async $verifyEmail(userId: number): Promise<boolean> {
    const result = await this.update(userId, {
      isEmailVerified: true,
      emailVerificationToken: null,
      status: T.UserStatus.ACTIVE
    } as any);

    return !!result.affected && result.affected > 0;
  }

  /**
   * Set password reset token
   * @param email - User email
   * @param token - Reset token
   * @param expiresIn - Expiration time in milliseconds (default: 1 hour)
   */
  async $setPasswordResetToken(email: string, token: string, expiresIn: number = 3600000): Promise<boolean> {
    const expiresAt = new Date(Date.now() + expiresIn);

    const result = await this.createQueryBuilder()
      .update(UserEntity)
      .set({
        passwordResetToken: token,
        passwordResetExpires: expiresAt
      })
      .where('email = :email', { email: email.toLowerCase() })
      .execute();

    return !!result.affected && result.affected > 0;
  }

  /**
   * Find user by password reset token
   * @param token - Reset token
   */
  async $findByPasswordResetToken(token: string): Promise<UserEntity | null> {
    return this.createQueryBuilder('user')
      .where('user.passwordResetToken = :token', { token })
      .andWhere('user.passwordResetExpires > :now', { now: new Date() })
      .addSelect('user.passwordResetToken')
      .addSelect('user.passwordResetExpires')
      .getOne();
  }

  /**
   * Clear password reset token
   * @param userId - User ID
   */
  async $clearPasswordResetToken(userId: number): Promise<void> {
    await this.update(userId, {
      passwordResetToken: null,
      passwordResetExpires: null
    } as any);
  }

  /**
   * Update user password
   * @param userId - User ID
   * @param hashedPassword - New hashed password
   */
  async $updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.createQueryBuilder()
      .update(UserEntity)
      .set({ password: hashedPassword })
      .where('id = :userId', { userId })
      .execute();
  }

  /**
   * Suspend user account
   * @param userId - User ID
   * @param reason - Suspension reason (optional)
   */
  async $suspendUser(userId: number): Promise<boolean> {
    const result = await this.update(userId, {
      status: T.UserStatus.SUSPENDED
    } as any);

    return !!result.affected && result.affected > 0;
  }

  /**
   * Activate user account
   * @param userId - User ID
   */
  async $activateUser(userId: number): Promise<boolean> {
    const result = await this.update(userId, {
      status: T.UserStatus.ACTIVE
    } as any);

    return !!result.affected && result.affected > 0;
  }

  /**
   * Deactivate user account
   * @param userId - User ID
   */
  async $deactivateUser(userId: number): Promise<boolean> {
    const result = await this.update(userId, {
      status: T.UserStatus.INACTIVE
    } as any);

    return !!result.affected && result.affected > 0;
  }

  /**
   * Check if email exists
   * @param email - Email to check
   * @param excludeUserId - User ID to exclude from check (for updates)
   */
  async $emailExists(email: string, excludeUserId?: number): Promise<boolean> {
    const query = this.createQueryBuilder('user').where('user.email = :email', {
      email: email.toLowerCase()
    });

    if (excludeUserId) {
      query.andWhere('user.id != :excludeUserId', { excludeUserId });
    }

    const count = await query.getCount();
    return count > 0;
  }

  /**
   * Get recently registered users
   * @param days - Number of days to look back (default: 7)
   * @param limit - Maximum number of users to return
   */
  async $getRecentlyRegistered(days: number = 7, limit: number = 10): Promise<UserEntity[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.createQueryBuilder('user')
      .where('user.createdAt >= :startDate', { startDate })
      .orderBy('user.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  /**
   * Get active users (logged in within specified days)
   * @param days - Number of days to consider as active (default: 30)
   * @param limit - Maximum number of users to return
   */
  async $getActiveUsers(days: number = 30, limit: number = 10): Promise<UserEntity[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.createQueryBuilder('user')
      .where('user.lastLoginAt >= :startDate', { startDate })
      .orderBy('user.lastLoginAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  /**
   * Find users by age range
   * @param minAge - Minimum age
   * @param maxAge - Maximum age
   */
  async $findByAgeRange(minAge: number, maxAge: number): Promise<UserEntity[]> {
    const now = new Date();
    const maxDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
    const minDate = new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate());

    return this.createQueryBuilder('user')
      .where('user.dateOfBirth IS NOT NULL')
      .andWhere('user.dateOfBirth <= :maxDate', { maxDate })
      .andWhere('user.dateOfBirth > :minDate', { minDate })
      .orderBy('user.dateOfBirth', 'DESC')
      .getMany();
  }

  /**
   * Bulk update user status
   * @param userIds - Array of user IDs
   * @param status - New status
   */
  async $bulkUpdateStatus(userIds: number[], status: T.UserStatus): Promise<number> {
    const result = await this.createQueryBuilder().update(UserEntity).set({ status }).whereInIds(userIds).execute();

    return result.affected || 0;
  }

  /**
   * Bulk update user role
   * @param userIds - Array of user IDs
   * @param role - New role
   */
  async $bulkUpdateRole(userIds: number[], role: T.UserRole): Promise<number> {
    const result = await this.createQueryBuilder().update(UserEntity).set({ role }).whereInIds(userIds).execute();

    return result.affected || 0;
  }

  /**
   * Get users with incomplete profiles
   */
  async $getUsersWithIncompleteProfiles(): Promise<UserEntity[]> {
    return this.createQueryBuilder('user')
      .where(
        new Brackets(qb => {
          qb.where('user.phoneNumber IS NULL')
            .orWhere('user.dateOfBirth IS NULL')
            .orWhere('user.gender IS NULL')
            .orWhere('user.avatar IS NULL');
        })
      )
      .getMany();
  }

  /**
   * Advanced user filtering with pagination
   * @param filters - Filter criteria
   */
  async $advancedFilter(filters: {
    roles?: T.UserRole[];
    statuses?: T.UserStatus[];
    isEmailVerified?: boolean;
    hasAvatar?: boolean;
    createdAfter?: Date;
    createdBefore?: Date;
    lastLoginAfter?: Date;
    lastLoginBefore?: Date;
    minLoginCount?: number;
    gender?: T.UserGender;
    ageMin?: number;
    ageMax?: number;
    sortBy?: keyof UserEntity;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
  }): Promise<{ users: UserEntity[]; total: number; page: number; totalPages: number }> {
    const query = this.createQueryBuilder('user');

    // Role filter
    if (filters.roles && filters.roles.length > 0) {
      query.andWhere('user.role IN (:...roles)', { roles: filters.roles });
    }

    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
      query.andWhere('user.status IN (:...statuses)', { statuses: filters.statuses });
    }

    // Email verified filter
    if (filters.isEmailVerified !== undefined) {
      query.andWhere('user.isEmailVerified = :isEmailVerified', {
        isEmailVerified: filters.isEmailVerified
      });
    }

    // Avatar filter
    if (filters.hasAvatar !== undefined) {
      if (filters.hasAvatar) {
        query.andWhere('user.avatar IS NOT NULL');
      } else {
        query.andWhere('user.avatar IS NULL');
      }
    }

    // Date range filters
    if (filters.createdAfter) {
      query.andWhere('user.createdAt >= :createdAfter', { createdAfter: filters.createdAfter });
    }

    if (filters.createdBefore) {
      query.andWhere('user.createdAt <= :createdBefore', {
        createdBefore: filters.createdBefore
      });
    }

    if (filters.lastLoginAfter) {
      query.andWhere('user.lastLoginAt >= :lastLoginAfter', {
        lastLoginAfter: filters.lastLoginAfter
      });
    }

    if (filters.lastLoginBefore) {
      query.andWhere('user.lastLoginAt <= :lastLoginBefore', {
        lastLoginBefore: filters.lastLoginBefore
      });
    }

    // Login count filter
    if (filters.minLoginCount !== undefined) {
      query.andWhere('user.loginCount >= :minLoginCount', {
        minLoginCount: filters.minLoginCount
      });
    }

    // Gender filter
    if (filters.gender) {
      query.andWhere('user.gender = :gender', { gender: filters.gender });
    }

    // Age range filter
    if (filters.ageMin !== undefined || filters.ageMax !== undefined) {
      const now = new Date();

      if (filters.ageMax !== undefined) {
        const maxDate = new Date(now.getFullYear() - filters.ageMin!, now.getMonth(), now.getDate());
        query.andWhere('user.dateOfBirth <= :maxDate', { maxDate });
      }

      if (filters.ageMin !== undefined) {
        const minDate = new Date(now.getFullYear() - filters.ageMax! - 1, now.getMonth(), now.getDate());
        query.andWhere('user.dateOfBirth > :minDate', { minDate });
      }
    }

    // Sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'DESC';
    query.orderBy(`user.${sortBy}`, sortOrder);

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    query.skip(offset).take(limit);

    const [users, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      totalPages
    };
  }

  /**
   * Get user profile completion percentage
   * @param userId - User ID
   */
  async $getProfileCompletionPercentage(userId: number): Promise<number> {
    const user = await this.findById(userId);
    if (!user) return 0;

    const fields = [
      user.email,
      user.firstName,
      user.lastName,
      user.phoneNumber,
      user.dateOfBirth,
      user.gender,
      user.avatar,
      user.bio,
      user.timezone,
      user.language
    ];

    const completedFields = fields.filter(field => field !== null && field !== undefined).length;
    return Math.round((completedFields / fields.length) * 100);
  }
}
