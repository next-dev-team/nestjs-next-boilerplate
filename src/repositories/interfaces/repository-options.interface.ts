export interface FindUserOptions {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
  isEmailVerified?: boolean;
  phoneNumber?: string;
  // Add pagination
  skip?: number;
  limit?: number;
  // Add sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | 'ASC' | 'DESC';
}

export interface FindTodoOptions {
  title?: string;
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string | number;
  createdBy?: string | number;
  isArchived?: boolean;
  tags?: string[];
  // Add pagination
  skip?: number;
  limit?: number;
  // Add sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | 'ASC' | 'DESC';
}
