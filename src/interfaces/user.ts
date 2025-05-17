export type UserRole = 'admin' | 'agent' | 'client';

export interface User {
  user_id: string;
  username: string;
  email: string;
  role: UserRole;
  department: string;
  company_id: string;
}
