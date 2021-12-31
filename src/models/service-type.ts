export enum ServiceTypeStatus {
  ACTIVE,
  DEACTIVE
}

export enum ServiceTypeValueType {
  STRING,
  NUMBER,
  BOOLEAN,
}

export interface ServiceType {
  id: string;
  name: string;
  value: Record<string, ServiceTypeValueType>;
  status: ServiceTypeStatus;
}

export interface ServiceTypeValue {
  key: string;
  type: ServiceTypeValueType;
}

export type ServiceTypeForm = Omit<ServiceType, 'id'>;