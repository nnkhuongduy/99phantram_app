import { GetUsersRequest, User } from 'src/models/user';
import { _99phantramApi } from '../slices/api';

export const userApi = _99phantramApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], GetUsersRequest>({
      query: () => ({
        url: '/users',
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetUsersQuery } = userApi;
