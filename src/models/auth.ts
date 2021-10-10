import { User } from './user';

export interface AuthRequest {
  username: string;
  password: string;
  remember: boolean;
}

export interface AuthResponse {
  identifier: User;
  token: string;
}
