import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const _99phantramApi = createApi({
  reducerPath: '_99phantramApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_ENDPOINT }),
  endpoints: () => ({}),
});
