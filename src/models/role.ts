export enum RoleLevel {
  CLIENT = 1,
  APP = 2,
  ALL = 3,
}

export interface Role {
  id: string;
  name: string;
  roleLevel: RoleLevel;
}