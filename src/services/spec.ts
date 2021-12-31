import { CATEGORY_CONSTANTS } from 'src/constants/category';
import { SpecForm } from 'src/models/spec';
import { _99phantramApi } from '../slices/api';

export const specApi = _99phantramApi.injectEndpoints({
  endpoints: (build) => ({
    createSpec: build.mutation<void, { id: string; form: SpecForm }>({
      query: ({ id, form }) => ({
        method: 'POST',
        url: '/app/specs/' + id,
        body: form,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: CATEGORY_CONSTANTS.CATEGORY_CACHE_ID, id },
      ],
    }),
    updateSpec: build.mutation<
      void,
      { categoryId: string; specId: string; form: SpecForm }
    >({
      query: ({ categoryId, specId, form }) => ({
        method: 'PUT',
        url: `/app/specs/${categoryId}/${specId}`,
        body: form,
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        { type: CATEGORY_CONSTANTS.CATEGORY_CACHE_ID, id: categoryId },
      ],
    }),
    deleteSpec: build.mutation<void, { categoryId: string; specId: string }>({
      query: ({ categoryId, specId }) => ({
        method: 'DELETE',
        url: `/app/specs/${categoryId}/${specId}`,
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        { type: CATEGORY_CONSTANTS.CATEGORY_CACHE_ID, id: categoryId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateSpecMutation,
  useUpdateSpecMutation,
  useDeleteSpecMutation,
} = specApi;
