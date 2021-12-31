import { SUPPLY_CONSTANTS } from 'src/constants/supply';
import { Supply, PutSupplyForm } from 'src/models/supply';
import { _99phantramApi } from '../slices/api';

export const serviceApi = _99phantramApi.injectEndpoints({
  endpoints: (build) => ({
    getSupplies: build.query<Supply[], void>({
      query: () => ({
        url: '/app/supplies',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: SUPPLY_CONSTANTS.SUPPLY_CACHE_ID,
                id,
              })),
              { type: SUPPLY_CONSTANTS.SUPPLY_CACHE_ID, id: 'LIST' },
            ]
          : [{ type: SUPPLY_CONSTANTS.SUPPLY_CACHE_ID, id: 'LIST' }],
    }),
    getSupply: build.query<Supply, string>({
      query: (id) => ({
        url: '/app/supplies/' + id,
      }),
      providesTags: (result, error, id) => [
        { type: SUPPLY_CONSTANTS.SUPPLY_CACHE_ID, id },
      ],
    }),
    updateSupply: build.mutation<void, { id: string; form: PutSupplyForm }>({
      query: ({ id, form }) => ({
        method: 'PUT',
        url: '/app/supplies/' + id,
        body: form,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: SUPPLY_CONSTANTS.SUPPLY_CACHE_ID, id },
      ],
    }),
    deleteSupply: build.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: '/app/supplies/' + id,
      }),
      invalidatesTags: () => [
        { type: SUPPLY_CONSTANTS.SUPPLY_CACHE_ID, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSuppliesQuery,
  useGetSupplyQuery,
  useUpdateSupplyMutation,
  useDeleteSupplyMutation,
} = serviceApi;
