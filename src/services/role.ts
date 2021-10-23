import { Role } from 'src/models/role';
import { _99phantramApi } from 'src/slices/api';

export const roleApi = _99phantramApi.injectEndpoints({
  endpoints: (build) => ({
    getSelectableRoles: build.query<Role[], void>({
      query: () => ({
        url: '/app/roles/selectable',
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetSelectableRolesQuery } = roleApi;
