import { Category } from './category';
import { Service } from './service';
import { Spec } from './spec';
import { User } from './user';
import { Location } from './location';

export enum ProductStatus {
  '99%',
  '90%',
  '80%',
  '<80%',
}

export enum SupplyStatus {
  WAITING,
  DECLINED,
  ACTIVE,
  SOLD,
  ARCHIVED,
}

export interface Supply {
  id: string;
  owner: User;
  name: string;
  price: number;
  description: string;
  services: Service[];
  specs: Spec[];
  images: string[];
  thumbnail: string;
  categories: Category[];
  locations: Location[];
  address: string;
  reason: string;
  productStatus: ProductStatus;
  status: SupplyStatus;
  createdOn: string;
  modifiedOn: string;
}

export type PutSupplyForm = Pick<Supply, 'status'> & {
  sendEmail: boolean;
  reason?: string;
};
