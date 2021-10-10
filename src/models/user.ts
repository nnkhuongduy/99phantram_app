import { Role } from "./role";

export enum OauthProvider {
  Facebook,
  Google,
}

export enum UserStatus {
  PENDING,
  VERIFIED,
  ARCHIVED,
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  sex: number;
  address?: string;
  phoneNumber?: string;
  avatar?: {
    id: string;
    url: string;
  };
  oauth: boolean;
  oauthProvider?: OauthProvider;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface GetUsersRequest {}
