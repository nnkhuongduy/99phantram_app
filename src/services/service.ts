import { SERVICE_CONSTANTS } from 'src/constants/service';
import { Service, ServiceForm } from 'src/models/service';
import { _99phantramApi } from '../slices/api';

export const serviceApi = _99phantramApi.injectEndpoints({
  endpoints: (build) => ({
    getServices: build.query<Service[], void>({
      query: () => ({
        url: '/app/services',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: SERVICE_CONSTANTS.SERVICE_CACHE_ID,
                id,
              })),
              { type: SERVICE_CONSTANTS.SERVICE_CACHE_ID, id: 'LIST' },
            ]
          : [{ type: SERVICE_CONSTANTS.SERVICE_CACHE_ID, id: 'LIST' }],
    }),
    getService: build.query<Service, string>({
      query: (id) => ({
        url: '/app/services/' + id,
      }),
      providesTags: (result, error, id) => [
        { type: SERVICE_CONSTANTS.SERVICE_CACHE_ID, id },
      ],
    }),
    createService: build.mutation<void, ServiceForm>({
      query: (request) => ({
        method: 'POST',
        url: '/app/services',
        body: request,
      }),
      invalidatesTags: [
        { type: SERVICE_CONSTANTS.SERVICE_CACHE_ID, id: 'LIST' },
      ],
    }),
    updateService: build.mutation<void, { id: string; form: ServiceForm }>({
      query: ({ id, form }) => ({
        method: 'PUT',
        url: '/app/services/' + id,
        body: form,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: SERVICE_CONSTANTS.SERVICE_CACHE_ID, id },
      ],
    }),
    deleteService: build.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: '/app/services/' + id,
      }),
      invalidatesTags: () => [
        { type: SERVICE_CONSTANTS.SERVICE_CACHE_ID, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetServicesQuery,
  useCreateServiceMutation,
  useGetServiceQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi;
