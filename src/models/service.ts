import { ServiceType } from './service-type';

export enum ServiceStatus {
  ACTIVE,
  EXPIRED,
}

export interface Service {
  id: string;
  name: string;
  serviceType: ServiceType;
  value: Record<string, any>;
  status: ServiceStatus;
  createdOn: string;
  updatedOn: string;
}

export interface ServiceValue<T = any> {
  key: string;
  value: T
}

export type ServiceForm = Omit<Service, 'id' | 'createdOn' | 'updatedOn' | 'serviceType'> & {
  serviceType: string;
};
