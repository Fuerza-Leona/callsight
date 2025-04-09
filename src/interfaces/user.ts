export type UserRole = 'admin' | 'agent' | 'leader' | 'client';

export interface User {
  user_id: string;
  username: string;
  email: string;
  role: UserRole;
  department: string;
}
