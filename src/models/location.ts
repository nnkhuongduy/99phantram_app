export enum LocationLevel {
  PROVINCE,
  WARD,
  BLOCK,
}

export enum LocationStatus {
  NEW,
  ACTIVE,
  ARCHIVED,
}

export interface Location {
  id: string;
  name: string;
  locationLevel: LocationLevel;
  status: LocationStatus;
  subLocations: Location[];
  subLocationsRef: string[];
}

export type LocationForm = Omit<Location, 'id' | 'subLocations' | 'subLocationsRef'> & {
  subLocations: string[];
};
