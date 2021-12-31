import { Spec } from './spec';

export enum CategoryLevel {
  PRIMARY,
  SECONDARY,
}

export enum CategoryStatus {
  NEW,
  ACTIVE,
  ARCHIVED,
}

export interface Category {
  id: string;
  name: string;
  image: string;
  categoryLevel: CategoryLevel;
  status: CategoryStatus;
  specs: Spec[];
  subCategories: string[];
  slug: string;
}

export type CategoryPostForm = Omit<Category, 'id' | 'specs' | 'subCategories'>;

export type CategoryPutForm = Omit<Category, 'id' | 'specs'> & {
  specs: string[];
};
