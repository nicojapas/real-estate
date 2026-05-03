import { PropertyInputs } from './types';

export interface SavedConfiguration {
  id: string;
  name: string;
  inputs: PropertyInputs;
  createdAt: number;
  updatedAt: number;
}
