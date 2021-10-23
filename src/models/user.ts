import { Role } from './role';

export enum OauthProvider {
  Facebook,
  Google,
}

export enum UserStatus {
  PENDING,
  VERIFIED,
  ARCHIVED,
}

export enum Gender {
  'Nam',
  'Nữ',
  'Khác',
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  sex: Gender;
  address?: string;
  phoneNumber?: string;
  avatar?: string;
  oauth: boolean;
  oauthProvider?: OauthProvider;
  role: Role;
  status: UserStatus;
  createdOn: string;
  modifiedOn: string;
}

export type UserForm = Omit<
  User,
  'id' | 'oauth' | 'oauthProvider' | 'createdAt' | 'role'
> & {
  role: string;
};
