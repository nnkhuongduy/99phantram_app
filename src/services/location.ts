import { LOCATION_CONSTANTS } from 'src/constants/location';
import { Location, LocationForm } from 'src/models/location';
import { _99phantramApi } from '../slices/api';

export const locationApi = _99phantramApi.injectEndpoints({
  endpoints: (build) => ({
    getLocations: build.query<Location[], void>({
      query: () => ({
        url: '/app/locations',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: LOCATION_CONSTANTS.LOCATION_CACHE_ID,
                id,
              })),
              { type: LOCATION_CONSTANTS.LOCATION_CACHE_ID, id: 'LIST' },
            ]
          : [{ type: LOCATION_CONSTANTS.LOCATION_CACHE_ID, id: 'LIST' }],
    }),
    getLocation: build.query<Location, string>({
      query: (id) => ({
        url: '/app/locations/' + id,
      }),
      providesTags: (result, error, id) => [
        { type: LOCATION_CONSTANTS.LOCATION_CACHE_ID, id },
      ],
    }),
    createLocation: build.mutation<void, LocationForm>({
      query: (request) => ({
        method: 'POST',
        url: '/app/locations',
        body: request,
      }),
      invalidatesTags: [
        { type: LOCATION_CONSTANTS.LOCATION_CACHE_ID, id: 'LIST' },
      ],
    }),
    updateLocation: build.mutation<void, { id: string; form: LocationForm }>({
      query: ({ id, form }) => ({
        method: 'PUT',
        url: '/app/locations/' + id,
        body: form,
      }),
      invalidatesTags: (result, error, { id, form }) => [
        { type: LOCATION_CONSTANTS.LOCATION_CACHE_ID, id },
      ],
    }),
    deleteLocation: build.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: '/app/locations/' + id,
      }),
      invalidatesTags: () => [
        { type: LOCATION_CONSTANTS.LOCATION_CACHE_ID, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetLocationsQuery,
  useLazyGetLocationsQuery,
  useCreateLocationMutation,
  useGetLocationQuery,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationApi;
