import { Employee } from './employee';

export interface AuthRequest {
  username: string;
  password: string;
  remember: boolean;
}

export interface AuthResponse {
  identifier: Employee;
  token: string;
}
