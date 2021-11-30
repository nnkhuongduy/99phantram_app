import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CATEGORY_CONSTANTS } from 'src/constants/category';
import { LOCATION_CONSTANTS } from 'src/constants/location';
import { USER_CONSTANTS } from 'src/constants/user';
import { SERVICE_TYPE_CONSTANTS } from 'src/constants/service-type';
import { SERVICE_CONSTANTS } from 'src/constants/service';
import { SUPPLY_CONSTANTS } from 'src/constants/supply';
import { RootState } from './store';

export const _99phantramApi = createApi({
  reducerPath: '_99phantramApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_ENDPOINT,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    USER_CONSTANTS.USER_CACHE_ID,
    CATEGORY_CONSTANTS.CATEGORY_CACHE_ID,
    LOCATION_CONSTANTS.LOCATION_CACHE_ID,
    SERVICE_TYPE_CONSTANTS.SERVICE_TYPE_CACHE_ID,
    SERVICE_CONSTANTS.SERVICE_CACHE_ID,
    SUPPLY_CONSTANTS.SUPPLY_CACHE_ID,
  ],
  endpoints: () => ({}),
});
