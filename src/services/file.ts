import { _99phantramApi } from 'src/slices/api';

export const fileApi = _99phantramApi.injectEndpoints({
  endpoints: (build) => ({
    uploadAvatar: build.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        method: 'POST',
        url: '/file/avatar',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadAvatarMutation } = fileApi;
