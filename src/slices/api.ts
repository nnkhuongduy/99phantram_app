import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { USER_CONSTANTS } from 'src/constants/user';
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
  tagTypes: [USER_CONSTANTS.USER_CACHE_ID],
  endpoints: () => ({}),
});
