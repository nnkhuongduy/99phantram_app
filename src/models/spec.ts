export interface Spec {
  id: string;
  name: string;
  value: string;
  required: boolean;
  parent?: string;
}

export type SpecForm = Omit<Spec, 'id' | 'value'>;
