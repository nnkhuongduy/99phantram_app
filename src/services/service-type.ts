import { SERVICE_TYPE_CONSTANTS } from 'src/constants/service-type';
import { ServiceType, ServiceTypeForm } from 'src/models/service-type';
import { _99phantramApi } from '../slices/api';

export const serviceTypeApi = _99phantramApi.injectEndpoints({
  endpoints: (build) => ({
    getServiceTypes: build.query<ServiceType[], void>({
      query: () => ({
        url: '/app/service-types',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: SERVICE_TYPE_CONSTANTS.SERVICE_TYPE_CACHE_ID,
                id,
              })),
              { type: SERVICE_TYPE_CONSTANTS.SERVICE_TYPE_CACHE_ID, id: 'LIST' },
            ]
          : [{ type: SERVICE_TYPE_CONSTANTS.SERVICE_TYPE_CACHE_ID, id: 'LIST' }],
    }),
    getServiceType: build.query<ServiceType, string>({
      query: (id) => ({
        url: '/app/service-types/' + id,
      }),
      providesTags: (result, error, id) => [
        { type: SERVICE_TYPE_CONSTANTS.SERVICE_TYPE_CACHE_ID, id },
      ],
    }),
    createServiceType: build.mutation<void, ServiceTypeForm>({
      query: (request) => ({
        method: 'POST',
        url: '/app/service-types',
        body: request,
      }),
      invalidatesTags: [
        { type: SERVICE_TYPE_CONSTANTS.SERVICE_TYPE_CACHE_ID, id: 'LIST' },
      ],
    }),
    updateServiceType: build.mutation<void, { id: string; form: ServiceTypeForm }>({
      query: ({ id, form }) => ({
        method: 'PUT',
        url: '/app/service-types/' + id,
        body: form,
      }),
      invalidatesTags: (result, error, { id, form }) => [
        { type: SERVICE_TYPE_CONSTANTS.SERVICE_TYPE_CACHE_ID, id },
      ],
    }),
    deleteServiceType: build.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: '/app/service-types/' + id,
      }),
      invalidatesTags: () => [
        { type: SERVICE_TYPE_CONSTANTS.SERVICE_TYPE_CACHE_ID, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetServiceTypesQuery,
  useLazyGetServiceTypesQuery,
  useCreateServiceTypeMutation,
  useGetServiceTypeQuery,
  useUpdateServiceTypeMutation,
  useDeleteServiceTypeMutation,
} = serviceTypeApi;
