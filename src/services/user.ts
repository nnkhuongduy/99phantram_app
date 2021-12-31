import { USER_CONSTANTS } from 'src/constants/user';
import { UserForm, User } from 'src/models/user';
import { _99phantramApi } from '../slices/api';

export const userApi = _99phantramApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => ({
        url: '/app/users',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: USER_CONSTANTS.USER_CACHE_ID,
                id,
              })),
              { type: USER_CONSTANTS.USER_CACHE_ID, id: 'LIST' },
            ]
          : [{ type: USER_CONSTANTS.USER_CACHE_ID, id: 'LIST' }],
    }),
    getUser: build.query<User, string>({
      query: (id) => ({
        url: '/app/users/' + id,
      }),
      providesTags: (result, error, id) => [
        { type: USER_CONSTANTS.USER_CACHE_ID, id },
      ],
    }),
    createUser: build.mutation<void, UserForm>({
      query: (request) => ({
        method: 'POST',
        url: '/app/users',
        body: request,
      }),
      invalidatesTags: [{ type: USER_CONSTANTS.USER_CACHE_ID, id: 'LIST' }],
    }),
    updateUser: build.mutation<void, { id: string; form: UserForm }>({
      query: ({ id, form }) => ({
        method: 'PUT',
        url: '/app/users/' + id,
        body: form,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: USER_CONSTANTS.USER_CACHE_ID, id },
      ],
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: '/app/users/' + id,
      }),
      invalidatesTags: (result, error, id) => [
        { type: USER_CONSTANTS.USER_CACHE_ID, id },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
