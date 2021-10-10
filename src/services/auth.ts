import { AuthResponse, AuthRequest } from 'src/models/auth';
import { User } from 'src/models/user';
import { _99phantramApi } from 'src/slices/api';

export const authApi = _99phantramApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, AuthRequest>({
      query: (request) => ({
        url: '/auth/login',
        method: 'POST',
        body: request,
      }),
    }),
    authenticate: build.query<User, void>({
      query: () => '/auth',
    }),
  }),
});

export const { useLoginMutation, useLazyAuthenticateQuery } = authApi;
