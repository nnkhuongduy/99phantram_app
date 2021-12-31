import { CATEGORY_CONSTANTS } from 'src/constants/category';
import {
  Category,
  CategoryPutForm,
  CategoryPostForm,
  CategoryStatus,
} from 'src/models/category';
import { _99phantramApi } from '../slices/api';

export const categoryApi = _99phantramApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], void>({
      query: () => ({
        url: '/app/categories',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: CATEGORY_CONSTANTS.CATEGORY_CACHE_ID,
                id,
              })),
              { type: CATEGORY_CONSTANTS.CATEGORY_CACHE_ID, id: 'LIST' },
            ]
          : [{ type: CATEGORY_CONSTANTS.CATEGORY_CACHE_ID, id: 'LIST' }],
    }),
    getCategory: build.query<Category, string>({
      query: (id) => ({
        url: '/app/categories/' + id,
      }),
      providesTags: (result, error, id) => [
        { type: CATEGORY_CONSTANTS.CATEGORY_CACHE_ID, id },
      ],
    }),
    createCategory: build.mutation<void, CategoryPostForm>({
      query: (request) => ({
        method: 'POST',
        url: '/app/categories',
        body: request,
      }),
      invalidatesTags: [
        { type: CATEGORY_CONSTANTS.CATEGORY_CACHE_ID, id: 'LIST' },
      ],
    }),
    updateCategory: build.mutation<void, { id: string; form: CategoryPutForm }>(
      {
        query: ({ id, form }) => ({
          method: 'PUT',
          url: '/app/categories/' + id,
          body: form,
        }),
        invalidatesTags: (result, error, { id, form }) =>
          form.status === CategoryStatus.ARCHIVED
            ? [{ type: CATEGORY_CONSTANTS.CATEGORY_CACHE_ID, id: 'LIST' }]
            : [{ type: CATEGORY_CONSTANTS.CATEGORY_CACHE_ID, id }],
      }
    ),
    deleteCategory: build.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: '/app/categories/' + id,
      }),
      invalidatesTags: () => [
        { type: CATEGORY_CONSTANTS.CATEGORY_CACHE_ID, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useCreateCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
